package com.ranger.aichat.service;

import com.ranger.aichat.client.GroqApiClient;
import com.ranger.aichat.dto.groq.GroqRequest;
import com.ranger.aichat.dto.groq.GroqResponse;
import com.ranger.aichat.entity.Message;
import com.ranger.aichat.exception.GroqApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GroqService {

    private final GroqApiClient groqApiClient;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.model:llama-3.1-8b-instant}")
    private String model;

    @Value("${groq.api.url:https://api.groq.com/openai/v1}")
    private String apiUrl;

    private static final String SYSTEM_PROMPT =
            "You are a helpful, harmless, and honest AI assistant. " +
                    "Provide clear, accurate, and concise responses. " +
                    "If you don't know something, say so rather than making up information.";

    public String sendMessage(String userMessage, List<Message> conversationHistory) {
        // Log input parameters
        log.info("=== GroqService.sendMessage called ===");
        log.info("User message length: {}", userMessage.length());
        log.info("Conversation history size: {}", conversationHistory.size());
        log.info("Model configured: {}", model);
        log.info("API URL configured: {}", apiUrl);
        log.info("API Key exists: {}", apiKey != null && !apiKey.isEmpty());

        try {
            List<Map<String, String>> messages = buildMessages(userMessage, conversationHistory);
            log.info("Built {} messages for Groq API", messages.size());
            log.debug("Messages structure: {}", messages);

            GroqRequest request = GroqRequest.builder()
                    .model(model)
                    .messages(messages)
                    .temperature(0.7)
                    .maxTokens(4096)
                    .topP(1.0)
                    .stream(false)
                    .build();

            log.info("Sending request to Groq API at: {}", apiUrl + "/chat/completions");
            log.debug("Request body: {}", request);

            GroqResponse response = groqApiClient.sendMessage("Bearer " + apiKey, request);

            if (response != null) {
                log.info("Response received from Groq API");
                log.debug("Full response: {}", response);

                if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                    String assistantMessage = response.getChoices().get(0).getMessage().getContent();
                    log.info("Successfully received response from Groq API, length: {}", assistantMessage.length());
                    log.debug("Assistant response preview: {}",
                            assistantMessage.length() > 100 ? assistantMessage.substring(0, 100) + "..." : assistantMessage);
                    return assistantMessage;
                } else {
                    log.error("No choices in Groq API response. Response: {}", response);
                    throw new GroqApiException("Empty response from Groq API - no choices available");
                }
            } else {
                log.error("Null response from Groq API");
                throw new GroqApiException("Null response from Groq API");
            }

        } catch (feign.FeignException e) {
            log.error("=== Feign Exception Details ===");
            log.error("Status: {}", e.status());
            log.error("Response Body: {}", e.contentUTF8());
            log.error("Response Headers: {}", e.responseHeaders());
            log.error("Feign Error Message: {}", e.getMessage(), e);
            throw new GroqApiException("Groq API error (HTTP " + e.status() + "): " + e.contentUTF8(), e);

        } catch (Exception e) {
            log.error("=== General Exception Details ===");
            log.error("Exception Type: {}", e.getClass().getName());
            log.error("Exception Message: {}", e.getMessage());
            log.error("Stack Trace: ", e);
            throw new GroqApiException("Failed to get response from Groq API: " + e.getMessage(), e);
        }
    }

    private List<Map<String, String>> buildMessages(String userMessage, List<Message> conversationHistory) {
        List<Map<String, String>> messages = new ArrayList<>();

        // Add system prompt
        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
        log.debug("Added system prompt");

        // Add conversation history (last 20 messages)
        int startIndex = Math.max(0, conversationHistory.size() - 20);
        log.debug("Adding {} messages from conversation history (from index {})",
                conversationHistory.size() - startIndex, startIndex);

        for (int i = startIndex; i < conversationHistory.size(); i++) {
            Message msg = conversationHistory.get(i);
            String role = msg.getRole().name().toLowerCase();
            messages.add(Map.of("role", role, "content", msg.getContent()));
            log.trace("Added message: role={}, content preview={}",
                    role, msg.getContent().length() > 50 ? msg.getContent().substring(0, 50) + "..." : msg.getContent());
        }

        // Add current user message
        messages.add(Map.of("role", "user", "content", userMessage));
        log.debug("Added user message");

        log.info("Total messages built: {}", messages.size());
        return messages;
    }
}
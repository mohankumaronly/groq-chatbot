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

    private static final String SYSTEM_PROMPT =
            "You are a helpful, harmless, and honest AI assistant. " +
                    "Provide clear, accurate, and concise responses. " +
                    "If you don't know something, say so rather than making up information.";

    public String sendMessage(String userMessage, List<Message> conversationHistory) {
        try {
            log.info("Sending request to Groq API with model: {}", model);

            List<Map<String, String>> messages = buildMessages(userMessage, conversationHistory);

            GroqRequest request = GroqRequest.builder()
                    .model(model)
                    .messages(messages)
                    .temperature(0.7)
                    .maxTokens(4096)
                    .topP(1.0)
                    .stream(false)
                    .build();

            GroqResponse response = groqApiClient.sendMessage("Bearer " + apiKey, request);

            if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                String assistantMessage = response.getChoices().get(0).getMessage().getContent();
                log.info("Successfully received response from Groq API");
                return assistantMessage;
            } else {
                throw new GroqApiException("Empty response from Groq API");
            }

        } catch (Exception e) {
            log.error("Error calling Groq API: {}", e.getMessage(), e);
            throw new GroqApiException("Failed to get response from Groq API: " + e.getMessage(), e);
        }
    }

    private List<Map<String, String>> buildMessages(String userMessage, List<Message> conversationHistory) {
        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));

        int startIndex = Math.max(0, conversationHistory.size() - 20);
        for (int i = startIndex; i < conversationHistory.size(); i++) {
            Message msg = conversationHistory.get(i);
            String role = msg.getRole().name().toLowerCase();
            messages.add(Map.of("role", role, "content", msg.getContent()));
        }

        messages.add(Map.of("role", "user", "content", userMessage));

        return messages;
    }
}
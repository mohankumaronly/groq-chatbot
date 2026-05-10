package com.ranger.aichat.service;

import com.ranger.aichat.dto.request.CreateConversationRequest;
import com.ranger.aichat.dto.request.SendMessageRequest;
import com.ranger.aichat.dto.response.ChatResponse;
import com.ranger.aichat.entity.Conversation;
import com.ranger.aichat.entity.Message;
import com.ranger.aichat.exception.ConversationNotFoundException;
import com.ranger.aichat.exception.GroqApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ConversationService conversationService;
    private final MessageService messageService;
    private final GroqService groqService;

    public ChatResponse sendMessage(SendMessageRequest request) {
        Long conversationId = request.getConversationId();
        String userMessage = request.getContent();

        log.info("Processing message for conversation: {}", conversationId);

        try {
            Conversation conversation = conversationService.getConversationById(conversationId);

            Message savedUserMessage = messageService.saveUserMessage(conversationId, userMessage);
            log.debug("Saved user message with id: {}", savedUserMessage.getId());

            List<Message> conversationHistory = messageService.getFormattedHistoryForGroq(conversationId);
            log.debug("Retrieved {} messages for context", conversationHistory.size());

            String aiResponse = groqService.sendMessage(userMessage, conversationHistory);

            Message savedAssistantMessage = messageService.saveAssistantMessage(conversationId, aiResponse);
            log.debug("Saved assistant message with id: {}", savedAssistantMessage.getId());

            return ChatResponse.builder()
                    .messageId(savedAssistantMessage.getId())
                    .conversationId(conversationId)
                    .assistantResponse(aiResponse)
                    .timestamp(LocalDateTime.now())
                    .model("llama3-8b-8192")
                    .build();

        } catch (ConversationNotFoundException e) {
            log.error("Conversation not found: {}", conversationId);
            throw e;
        } catch (GroqApiException e) {
            log.error("Groq API error for conversation {}: {}", conversationId, e.getMessage());

            String errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
            messageService.saveAssistantMessage(conversationId, errorMessage);

            throw e;
        } catch (Exception e) {
            log.error("Unexpected error processing message for conversation {}: {}", conversationId, e.getMessage(), e);
            throw new RuntimeException("Failed to process message: " + e.getMessage(), e);
        }
    }

    public ChatResponse sendMessageWithNewConversation(String userMessage, String conversationTitle) {
        log.info("Creating new conversation with title: {}", conversationTitle);

        CreateConversationRequest createRequest = new CreateConversationRequest(conversationTitle);
        conversationService.createConversation(createRequest);

        List<com.ranger.aichat.dto.response.ConversationResponse> conversations =
                conversationService.getAllUserConversations();

        if (conversations.isEmpty()) {
            throw new RuntimeException("Failed to create new conversation");
        }

        Long newConversationId = conversations.get(0).getId();

        SendMessageRequest sendRequest = new SendMessageRequest(newConversationId, userMessage);
        return sendMessage(sendRequest);
    }

    public ChatResponse regenerateResponse(Long conversationId) {
        log.info("Regenerating response for conversation: {}", conversationId);

        Message lastUserMessage = messageService.getLastUserMessage(conversationId);

        if (lastUserMessage == null) {
            throw new RuntimeException("No user message found to regenerate response for");
        }

        List<Message> conversationHistory = messageService.getFormattedHistoryForGroq(conversationId);

        if (!conversationHistory.isEmpty() &&
                conversationHistory.get(conversationHistory.size() - 1).getRole().name().equals("ASSISTANT")) {
            conversationHistory.remove(conversationHistory.size() - 1);
        }

        String newAiResponse = groqService.sendMessage(lastUserMessage.getContent(), conversationHistory);

        List<Message> allMessages = messageService.getFormattedHistoryForGroq(conversationId);
        Message lastAssistantMessage = allMessages.stream()
                .filter(m -> m.getRole().name().equals("ASSISTANT"))
                .reduce((first, second) -> second)
                .orElse(null);

        if (lastAssistantMessage != null) {
            messageService.deleteMessage(lastAssistantMessage.getId(), conversationId);
        }

        Message savedAssistantMessage = messageService.saveAssistantMessage(conversationId, newAiResponse);

        return ChatResponse.builder()
                .messageId(savedAssistantMessage.getId())
                .conversationId(conversationId)
                .assistantResponse(newAiResponse)
                .timestamp(LocalDateTime.now())
                .model("llama3-8b-8192")
                .build();
    }

    public void sendStreamingMessage(Long conversationId, String userMessage) {
        log.warn("Streaming not yet implemented");
        throw new UnsupportedOperationException("Streaming will be implemented in future version");
    }
}
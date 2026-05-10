package com.ranger.aichat.controller;

import com.ranger.aichat.dto.response.MessageResponse;
import com.ranger.aichat.service.MessageService;
import com.ranger.aichat.util.UserContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getConversationMessages(
            @PathVariable Long conversationId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get all messages for conversation: {} by user: {}", conversationId, userId);

        try {
            List<MessageResponse> messages = messageService.getConversationHistory(conversationId);
            return ResponseEntity.ok(messages);
        } finally {
            UserContextHolder.clear();
        }
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<MessageResponse> getMessageById(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get message {} from conversation: {} by user: {}", messageId, conversationId, userId);

        try {
            var message = messageService.getMessageById(messageId, conversationId);
            MessageResponse response = MessageResponse.builder()
                    .id(message.getId())
                    .conversationId(message.getConversation().getId())
                    .role(message.getRole())
                    .content(message.getContent())
                    .createdAt(message.getCreatedAt())
                    .build();

            return ResponseEntity.ok(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to delete message {} from conversation: {} by user: {}", messageId, conversationId, userId);

        try {
            messageService.deleteMessage(messageId, conversationId);
            return ResponseEntity.noContent().build();
        } finally {
            UserContextHolder.clear();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<MessageCountResponse> getMessageCount(
            @PathVariable Long conversationId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get message count for conversation: {} by user: {}", conversationId, userId);

        try {
            long count = messageService.getMessageCount(conversationId);
            return ResponseEntity.ok(new MessageCountResponse(count));
        } finally {
            UserContextHolder.clear();
        }
    }

    @GetMapping("/last-user")
    public ResponseEntity<MessageResponse> getLastUserMessage(
            @PathVariable Long conversationId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get last user message from conversation: {} by user: {}", conversationId, userId);

        try {
            var message = messageService.getLastUserMessage(conversationId);

            if (message == null) {
                return ResponseEntity.notFound().build();
            }

            MessageResponse response = MessageResponse.builder()
                    .id(message.getId())
                    .conversationId(message.getConversation().getId())
                    .role(message.getRole())
                    .content(message.getContent())
                    .createdAt(message.getCreatedAt())
                    .build();

            return ResponseEntity.ok(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<MessageResponse>> getRecentMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "10") int limit,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get last {} messages from conversation: {} by user: {}", limit, conversationId, userId);

        try {
            var messages = messageService.getLastNMessages(conversationId, limit);

            List<MessageResponse> responses = messages.stream()
                    .map(message -> MessageResponse.builder()
                            .id(message.getId())
                            .conversationId(message.getConversation().getId())
                            .role(message.getRole())
                            .content(message.getContent())
                            .createdAt(message.getCreatedAt())
                            .build())
                    .toList();

            return ResponseEntity.ok(responses);
        } finally {
            UserContextHolder.clear();
        }
    }

    @lombok.AllArgsConstructor
    @lombok.Data
    public static class MessageCountResponse {
        private long count;
    }
}
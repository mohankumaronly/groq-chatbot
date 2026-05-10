package com.ranger.aichat.controller;

import com.ranger.aichat.dto.request.SendMessageRequest;
import com.ranger.aichat.dto.response.ChatResponse;
import com.ranger.aichat.service.ChatService;
import com.ranger.aichat.util.UserContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatResponse> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            HttpServletRequest httpRequest) {

        // Get userId from request attribute (set by JwtAuthenticationFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to send message to conversation: {} by user: {}", request.getConversationId(), userId);

        try {
            ChatResponse response = chatService.sendMessage(request);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    @PostMapping("/send/new")
    public ResponseEntity<ChatResponse> sendMessageNewConversation(
            @RequestParam String message,
            @RequestParam(defaultValue = "New Conversation") String title,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to send message with new conversation: {} by user: {}", title, userId);

        try {
            ChatResponse response = chatService.sendMessageWithNewConversation(message, title);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    @PostMapping("/{conversationId}/regenerate")
    public ResponseEntity<ChatResponse> regenerateResponse(
            @PathVariable Long conversationId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to regenerate response for conversation: {} by user: {}", conversationId, userId);

        try {
            ChatResponse response = chatService.regenerateResponse(conversationId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ChatHealthResponse> healthCheck() {
        log.debug("Health check requested");

        ChatHealthResponse health = ChatHealthResponse.builder()
                .status("UP")
                .timestamp(java.time.LocalDateTime.now())
                .message("Chat service is running")
                .build();

        return ResponseEntity.ok(health);
    }

    @lombok.Builder
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ChatHealthResponse {
        private String status;
        private java.time.LocalDateTime timestamp;
        private String message;
    }
}
package com.ranger.aichat.controller;

import com.ranger.aichat.dto.request.CreateConversationRequest;
import com.ranger.aichat.dto.request.RenameConversationRequest;
import com.ranger.aichat.dto.response.ConversationResponse;
import com.ranger.aichat.service.ConversationService;
import com.ranger.aichat.util.UserContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
@Slf4j
public class ConversationController {

    private final ConversationService conversationService;

    /**
     * Create a new conversation
     * POST /api/conversations
     *
     * Request Body:
     * {
     *     "title": "My Spring Boot Discussion"
     * }
     */
    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to create conversation with title: {} by user: {}", request.getTitle(), userId);

        try {
            ConversationResponse response = conversationService.createConversation(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    /**
     * Get all conversations for the current user (with pagination)
     * GET /api/conversations?page=0&size=10
     *
     * Query Parameters:
     * - page: Page number (default: 0)
     * - size: Page size (default: 20)
     */
    @GetMapping
    public ResponseEntity<Page<ConversationResponse>> getAllConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get all conversations (page: {}, size: {}) for user: {}", page, size, userId);

        try {
            Page<ConversationResponse> conversations = conversationService.getUserConversations(page, size);
            return ResponseEntity.ok(conversations);
        } finally {
            UserContextHolder.clear();
        }
    }

    /**
     * Get all conversations without pagination (for dropdowns, etc.)
     * GET /api/conversations/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<ConversationResponse>> getAllConversationsUnpaginated(
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get all conversations (unpaginated) for user: {}", userId);

        try {
            List<ConversationResponse> conversations = conversationService.getAllUserConversations();
            return ResponseEntity.ok(conversations);
        } finally {
            UserContextHolder.clear();
        }
    }

    /**
     * Get a single conversation by ID
     * GET /api/conversations/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ConversationResponse> getConversationById(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get conversation with id: {} for user: {}", id, userId);

        try {
            var conversation = conversationService.getConversationById(id);

            // TODO: Get actual message count for this conversation from messageService
            Long messageCount = null;
            String lastMessagePreview = null;

            ConversationResponse response = ConversationResponse.builder()
                    .id(conversation.getId())
                    .title(conversation.getTitle())
                    .createdAt(conversation.getCreatedAt())
                    .updatedAt(conversation.getUpdatedAt())
                    .messageCount(messageCount)
                    .lastMessagePreview(lastMessagePreview)
                    .build();

            return ResponseEntity.ok(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    /**
     * Rename a conversation
     * PATCH /api/conversations/{id}
     *
     * Request Body:
     * {
     *     "conversationId": 123,
     *     "title": "New Title"
     * }
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ConversationResponse> renameConversation(
            @PathVariable Long id,
            @Valid @RequestBody RenameConversationRequest request,
            HttpServletRequest httpRequest) {

        // Ensure the ID in path matches the ID in request body
        if (!id.equals(request.getConversationId())) {
            log.warn("Path ID {} does not match body ID {}", id, request.getConversationId());
            return ResponseEntity.badRequest().build();
        }

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to rename conversation {} to '{}' for user: {}", id, request.getTitle(), userId);

        try {
            ConversationResponse response = conversationService.renameConversation(request);
            return ResponseEntity.ok(response);
        } finally {
            UserContextHolder.clear();
        }
    }

    /**
     * Delete a conversation
     * DELETE /api/conversations/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to delete conversation with id: {} for user: {}", id, userId);

        try {
            conversationService.deleteConversation(id);
            return ResponseEntity.noContent().build();
        } finally {
            UserContextHolder.clear();
        }
    }

    /**
     * Get total count of conversations for current user
     * GET /api/conversations/count
     */
    @GetMapping("/count")
    public ResponseEntity<CountResponse> getConversationCount(HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        UserContextHolder.setCurrentUserId(userId);

        log.info("REST request to get conversation count for user: {}", userId);

        try {
            long count = conversationService.getConversationCount();
            return ResponseEntity.ok(new CountResponse(count));
        } finally {
            UserContextHolder.clear();
        }
    }

    // Inner class for count response
    @lombok.AllArgsConstructor
    @lombok.Data
    public static class CountResponse {
        private long count;
    }
}
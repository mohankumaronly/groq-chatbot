package com.ranger.aichat.service;

import com.ranger.aichat.dto.request.CreateConversationRequest;
import com.ranger.aichat.dto.request.RenameConversationRequest;
import com.ranger.aichat.dto.response.ConversationResponse;
import com.ranger.aichat.entity.Conversation;
import com.ranger.aichat.exception.ConversationNotFoundException;
import com.ranger.aichat.mapper.ConversationMapper;
import com.ranger.aichat.repository.ConversationRepository;
import com.ranger.aichat.repository.MessageRepository;
import com.ranger.aichat.util.UserContextHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ConversationMapper conversationMapper;

    private Long getCurrentUserId() {
        // Get from SecurityContext or request attribute
        // For now, we'll inject via controller
        return UserContextHolder.getCurrentUserId();
    }

    // Create a new conversation
    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest request) {
        Long userId = getCurrentUserId();

        Conversation conversation = new Conversation();
        conversation.setUserId(userId);
        conversation.setTitle(request.getTitle());

        Conversation savedConversation = conversationRepository.save(conversation);
        log.info("Created new conversation with id: {} for user: {}", savedConversation.getId(), userId);

        return conversationMapper.toResponse(savedConversation, 0L, null);
    }

    // Get all conversations for current user with pagination
    public Page<ConversationResponse> getUserConversations(int page, int size) {
        Long userId = getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));

        Page<Conversation> conversations = conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId, pageable);

        return conversations.map(conversation -> {
            Long messageCount = messageRepository.countByConversationId(conversation.getId());
            List<com.ranger.aichat.entity.Message> messages =
                    messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
            String lastMessagePreview = conversationMapper.getLastMessagePreview(messages);

            return conversationMapper.toResponse(conversation, messageCount, lastMessagePreview);
        });
    }

    // Get all conversations (without pagination)
    public List<ConversationResponse> getAllUserConversations() {
        Long userId = getCurrentUserId();
        List<Conversation> conversations = conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId);

        return conversations.stream().map(conversation -> {
            Long messageCount = messageRepository.countByConversationId(conversation.getId());
            String lastMessagePreview = null;

            // Only fetch messages if we need preview (can be optimized)
            if (messageCount > 0) {
                List<com.ranger.aichat.entity.Message> messages =
                        messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
                lastMessagePreview = conversationMapper.getLastMessagePreview(messages);
            }

            return conversationMapper.toResponse(conversation, messageCount, lastMessagePreview);
        }).toList();
    }

    // Get a single conversation by ID (verifies ownership)
    public Conversation getConversationById(Long conversationId) {
        Long userId = getCurrentUserId();
        return conversationRepository.findByIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId, userId));
    }

    // Rename a conversation
    @Transactional
    public ConversationResponse renameConversation(RenameConversationRequest request) {
        Long userId = getCurrentUserId();

        int updatedRows = conversationRepository.updateTitleByIdAndUserId(
                request.getConversationId(),
                userId,
                request.getTitle()
        );

        if (updatedRows == 0) {
            throw new ConversationNotFoundException(request.getConversationId(), userId);
        }

        // Fetch the updated conversation
        Conversation updatedConversation = getConversationById(request.getConversationId());
        Long messageCount = messageRepository.countByConversationId(updatedConversation.getId());

        log.info("Renamed conversation id: {} to '{}'", updatedConversation.getId(), request.getTitle());

        return conversationMapper.toResponse(updatedConversation, messageCount, null);
    }

    // Delete a conversation (and all its messages automatically due to cascade)
    @Transactional
    public void deleteConversation(Long conversationId) {
        Long userId = getCurrentUserId();

        boolean exists = conversationRepository.existsByIdAndUserId(conversationId, userId);
        if (!exists) {
            throw new ConversationNotFoundException(conversationId, userId);
        }

        conversationRepository.deleteByIdAndUserId(conversationId, userId);
        log.info("Deleted conversation id: {} for user: {}", conversationId, userId);
    }

    // Get total conversation count for current user
    public long getConversationCount() {
        Long userId = getCurrentUserId();
        return conversationRepository.countByUserId(userId);
    }
}
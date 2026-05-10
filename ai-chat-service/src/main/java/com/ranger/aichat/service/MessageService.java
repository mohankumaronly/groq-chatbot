package com.ranger.aichat.service;

import com.ranger.aichat.dto.response.MessageResponse;
import com.ranger.aichat.entity.Conversation;
import com.ranger.aichat.entity.Message;
import com.ranger.aichat.entity.MessageRole;
import com.ranger.aichat.exception.ConversationNotFoundException;
import com.ranger.aichat.exception.MessageNotFoundException;
import com.ranger.aichat.mapper.MessageMapper;
import com.ranger.aichat.repository.MessageRepository;
import com.ranger.aichat.util.UserContextHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final ConversationService conversationService;

    // Helper method to verify conversation ownership
    private void verifyConversationOwnership(Long conversationId) {
        conversationService.getConversationById(conversationId);
    }

    // Save a user message
    @Transactional
    public Message saveUserMessage(Long conversationId, String content) {
        verifyConversationOwnership(conversationId);

        Conversation conversation = conversationService.getConversationById(conversationId);

        Message message = new Message();
        message.setConversation(conversation);
        message.setRole(MessageRole.USER);
        message.setContent(content);

        Message savedMessage = messageRepository.save(message);
        log.debug("Saved user message in conversation: {}", conversationId);

        return savedMessage;
    }

    // Save an assistant (AI) message
    @Transactional
    public Message saveAssistantMessage(Long conversationId, String content) {
        verifyConversationOwnership(conversationId);

        Conversation conversation = conversationService.getConversationById(conversationId);

        Message message = new Message();
        message.setConversation(conversation);
        message.setRole(MessageRole.ASSISTANT);
        message.setContent(content);

        Message savedMessage = messageRepository.save(message);
        log.debug("Saved assistant message in conversation: {}", conversationId);

        return savedMessage;
    }

    // Get all messages in a conversation (chat history)
    public List<MessageResponse> getConversationHistory(Long conversationId) {
        verifyConversationOwnership(conversationId);

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        return messageMapper.toResponseList(messages);
    }

    // Get conversation history formatted for Groq API (only USER and ASSISTANT messages)
    public List<Message> getFormattedHistoryForGroq(Long conversationId) {
        verifyConversationOwnership(conversationId);

        return messageRepository.findUserAndAssistantMessagesByConversationId(conversationId);
    }

    // Get last N messages for context window management
    public List<Message> getLastNMessages(Long conversationId, int limit) {
        verifyConversationOwnership(conversationId);

        return messageRepository.findLastNMessagesByConversationId(conversationId, limit);
    }

    // Get a single message by ID (with ownership verification)
    public Message getMessageById(Long messageId, Long conversationId) {
        verifyConversationOwnership(conversationId);

        return messageRepository.findByIdAndConversationId(messageId, conversationId)
                .orElseThrow(() -> new MessageNotFoundException(messageId, conversationId));
    }

    // Get the last user message in a conversation (useful for edit/regenerate)
    public Message getLastUserMessage(Long conversationId) {
        verifyConversationOwnership(conversationId);

        return messageRepository.findTopByConversationIdAndRoleOrderByCreatedAtDesc(
                conversationId, MessageRole.USER
        ).orElse(null);
    }

    // Delete a specific message (admin/reporting feature)
    @Transactional
    public void deleteMessage(Long messageId, Long conversationId) {
        verifyConversationOwnership(conversationId);

        Message message = getMessageById(messageId, conversationId);
        messageRepository.delete(message);
        log.info("Deleted message id: {} from conversation: {}", messageId, conversationId);
    }

    // Get total message count for a conversation
    public long getMessageCount(Long conversationId) {
        verifyConversationOwnership(conversationId);

        return messageRepository.countByConversationId(conversationId);
    }
}
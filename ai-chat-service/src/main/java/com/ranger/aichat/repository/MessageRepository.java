package com.ranger.aichat.repository;

import com.ranger.aichat.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Find all messages in a conversation (ordered by creation time - oldest first)
    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    // Find all messages in a conversation with pagination
    Page<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId, Pageable pageable);

    // Find a specific message by ID and verify it belongs to a conversation
    Optional<Message> findByIdAndConversationId(Long messageId, Long conversationId);

    // Get only user and assistant messages for sending to Groq (exclude system messages if any)
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId AND m.role IN ('USER', 'ASSISTANT') ORDER BY m.createdAt ASC")
    List<Message> findUserAndAssistantMessagesByConversationId(@Param("conversationId") Long conversationId);

    // Get the last N messages from a conversation (for context window management)
    @Query(value = "SELECT * FROM messages m WHERE m.conversation_id = :conversationId ORDER BY m.created_at DESC LIMIT :limit", nativeQuery = true)
    List<Message> findLastNMessagesByConversationId(@Param("conversationId") Long conversationId, @Param("limit") int limit);

    // Delete all messages in a conversation (when conversation is deleted)
    @Transactional
    @Modifying
    void deleteByConversationId(Long conversationId);

    // Count total messages in a conversation
    long countByConversationId(Long conversationId);

    // Get the last user message in a conversation (useful for edit/regenerate features)
    Optional<Message> findTopByConversationIdAndRoleOrderByCreatedAtDesc(Long conversationId, com.ranger.aichat.entity.MessageRole role);

    // Delete all messages for a specific user across all conversations (GDPR compliance)
    @Transactional
    @Modifying
    @Query("DELETE FROM Message m WHERE m.conversation.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
package com.ranger.aichat.repository;

import com.ranger.aichat.entity.Conversation;
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
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // Find all conversations for a specific user (returns Page for pagination)
    Page<Conversation> findByUserIdOrderByUpdatedAtDesc(Long userId, Pageable pageable);

    // Find all conversations for a specific user (returns List)
    List<Conversation> findByUserIdOrderByUpdatedAtDesc(Long userId);

    // Find a single conversation by ID and user ID (for security - ensures user owns the conversation)
    Optional<Conversation> findByIdAndUserId(Long id, Long userId);

    // Check if a conversation exists for a specific user
    boolean existsByIdAndUserId(Long id, Long userId);

    // Delete a conversation by ID and user ID (only if user owns it)
    @Transactional
    @Modifying
    void deleteByIdAndUserId(Long id, Long userId);

    // Update conversation title
    @Transactional
    @Modifying
    @Query("UPDATE Conversation c SET c.title = :title WHERE c.id = :id AND c.userId = :userId")
    int updateTitleByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId, @Param("title") String title);

    // Count total conversations for a user
    long countByUserId(Long userId);
}
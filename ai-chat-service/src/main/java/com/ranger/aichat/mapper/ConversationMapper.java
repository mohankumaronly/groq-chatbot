package com.ranger.aichat.mapper;

import com.ranger.aichat.dto.response.ConversationResponse;
import com.ranger.aichat.entity.Conversation;
import com.ranger.aichat.entity.Message;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConversationMapper {

    public ConversationResponse toResponse(Conversation conversation, Long messageCount, String lastMessagePreview) {
        if (conversation == null) {
            return null;
        }

        return ConversationResponse.builder()
                .id(conversation.getId())
                .title(conversation.getTitle())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .messageCount(messageCount)
                .lastMessagePreview(lastMessagePreview)
                .build();
    }

    public ConversationResponse toResponse(Conversation conversation) {
        return toResponse(conversation, 0L, null);
    }

    public String getLastMessagePreview(List<Message> messages) {
        if (messages == null || messages.isEmpty()) {
            return null;
        }

        // Get the last message (most recent)
        Message lastMessage = messages.get(messages.size() - 1);
        String content = lastMessage.getContent();

        // Return first 50 characters as preview, add ellipsis if longer
        if (content.length() > 50) {
            return content.substring(0, 50) + "...";
        }
        return content;
    }
}
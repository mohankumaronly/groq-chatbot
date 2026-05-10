package com.ranger.aichat.mapper;

import com.ranger.aichat.dto.response.MessageResponse;
import com.ranger.aichat.entity.Message;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MessageMapper {

    public MessageResponse toResponse(Message message) {
        if (message == null) {
            return null;
        }

        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .role(message.getRole())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public List<MessageResponse> toResponseList(List<Message> messages) {
        if (messages == null) {
            return null;
        }

        return messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
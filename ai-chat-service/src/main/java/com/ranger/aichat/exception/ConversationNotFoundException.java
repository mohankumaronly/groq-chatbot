package com.ranger.aichat.exception;

public class ConversationNotFoundException extends RuntimeException {

    public ConversationNotFoundException(Long conversationId) {
        super("Conversation not found with id: " + conversationId);
    }

    public ConversationNotFoundException(Long conversationId, Long userId) {
        super("Conversation not found with id: " + conversationId + " for user: " + userId);
    }

    public ConversationNotFoundException(String message) {
        super(message);
    }
}
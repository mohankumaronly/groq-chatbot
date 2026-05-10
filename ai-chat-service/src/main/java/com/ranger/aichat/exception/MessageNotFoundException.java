package com.ranger.aichat.exception;

public class MessageNotFoundException extends RuntimeException {

    public MessageNotFoundException(Long messageId) {
        super("Message not found with id: " + messageId);
    }

    public MessageNotFoundException(Long messageId, Long conversationId) {
        super("Message not found with id: " + messageId + " in conversation: " + conversationId);
    }

    public MessageNotFoundException(String message) {
        super(message);
    }
}
package com.ranger.aichat.exception;

public class GroqApiException extends RuntimeException {

    private final int statusCode;
    private final String errorDetails;

    public GroqApiException(String message) {
        super(message);
        this.statusCode = 500;
        this.errorDetails = null;
    }

    public GroqApiException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
        this.errorDetails = null;
    }

    public GroqApiException(String message, int statusCode, String errorDetails) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getErrorDetails() {
        return errorDetails;
    }
}
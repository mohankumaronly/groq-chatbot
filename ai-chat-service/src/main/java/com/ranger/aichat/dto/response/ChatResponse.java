package com.ranger.aichat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private Long messageId;
    private Long conversationId;
    private String assistantResponse;
    private LocalDateTime timestamp;
    private Integer tokenCount;  // Optional: track token usage
    private String model;  // Which Groq model was used
}
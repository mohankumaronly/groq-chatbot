package com.ranger.aichat.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotNull(message = "Conversation ID cannot be null")
    private Long conversationId;

    @NotBlank(message = "Message content cannot be blank")
    @Size(min = 1, max = 10000, message = "Message content must be between 1 and 10000 characters")
    private String content;
}
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
public class RenameConversationRequest {

    @NotNull(message = "Conversation ID cannot be null")
    private Long conversationId;

    @NotBlank(message = "Conversation title cannot be blank")
    @Size(min = 1, max = 255, message = "Conversation title must be between 1 and 255 characters")
    private String title;
}
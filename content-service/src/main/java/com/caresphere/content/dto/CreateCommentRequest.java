package com.caresphere.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateCommentRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Text is required")
    private String text;
}

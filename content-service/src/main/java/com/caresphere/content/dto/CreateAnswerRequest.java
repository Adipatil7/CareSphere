package com.caresphere.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateAnswerRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Answer is required")
    private String answer;
}

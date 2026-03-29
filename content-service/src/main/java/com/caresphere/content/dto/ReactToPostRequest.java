package com.caresphere.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.UUID;

@Data
public class ReactToPostRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Reaction type is required")
    @Pattern(regexp = "LIKE|HELPFUL", message = "Reaction type must be LIKE or HELPFUL")
    private String reactionType;
}

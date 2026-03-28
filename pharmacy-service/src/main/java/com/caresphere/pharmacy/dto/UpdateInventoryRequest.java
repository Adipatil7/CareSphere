package com.caresphere.pharmacy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInventoryRequest {

    @NotNull(message = "chemistId is required")
    private UUID chemistId;

    @NotBlank(message = "medicineName is required")
    private String medicineName;

    @Min(value = 0, message = "quantity must be at least 0")
    private int quantity;
}

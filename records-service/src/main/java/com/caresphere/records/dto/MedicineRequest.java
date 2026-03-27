package com.caresphere.records.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineRequest {

    @NotNull(message = "name is required")
    private String name;

    @NotNull(message = "dosage is required")
    private String dosage;

    @NotNull(message = "duration is required")
    private String duration;

    private String instructions;
}

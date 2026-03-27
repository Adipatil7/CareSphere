package com.caresphere.records.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVisitRequest {

    @NotNull(message = "consultId is required")
    private UUID consultId;

    @NotNull(message = "doctorId is required")
    private UUID doctorId;

    @NotNull(message = "patientId is required")
    private UUID patientId;

    private String notes;
}

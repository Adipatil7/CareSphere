package com.caresphere.records.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePrescriptionRequest {

    @NotNull(message = "visitId is required")
    private UUID visitId;

    @NotEmpty(message = "medicines list must not be empty")
    @Valid
    private List<MedicineRequest> medicines;
}

package com.caresphere.consultation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartConsultRequest {

    @NotNull(message = "appointmentId is required")
    private UUID appointmentId;

    @NotNull(message = "doctorId is required")
    private UUID doctorId;

    @NotNull(message = "patientId is required")
    private UUID patientId;
}

package com.caresphere.consultation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultEvent {

    private String consultId;
    private String appointmentId;
    private String doctorId;
    private String patientId;
}

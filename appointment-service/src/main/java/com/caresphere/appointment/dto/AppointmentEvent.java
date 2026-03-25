package com.caresphere.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentEvent {

    private String appointmentId;
    private String patientId;
    private String doctorId;
    private String status;
    private String startTime;
}

package com.caresphere.consultation.dto;

import com.caresphere.consultation.entity.ConsultSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultSessionResponse {

    private UUID id;
    private UUID appointmentId;
    private String roomId;
    private UUID doctorId;
    private UUID patientId;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    public static ConsultSessionResponse fromEntity(ConsultSession session) {
        return ConsultSessionResponse.builder()
                .id(session.getId())
                .appointmentId(session.getAppointmentId())
                .roomId(session.getRoomId())
                .doctorId(session.getDoctorId())
                .patientId(session.getPatientId())
                .status(session.getStatus().name())
                .startedAt(session.getStartedAt())
                .endedAt(session.getEndedAt())
                .build();
    }
}

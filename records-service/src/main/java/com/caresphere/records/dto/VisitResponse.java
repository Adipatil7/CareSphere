package com.caresphere.records.dto;

import com.caresphere.records.entity.Visit;
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
public class VisitResponse {

    private UUID id;
    private UUID consultId;
    private UUID doctorId;
    private UUID patientId;
    private String notes;
    private LocalDateTime createdAt;

    public static VisitResponse fromEntity(Visit visit) {
        return VisitResponse.builder()
                .id(visit.getId())
                .consultId(visit.getConsultId())
                .doctorId(visit.getDoctorId())
                .patientId(visit.getPatientId())
                .notes(visit.getNotes())
                .createdAt(visit.getCreatedAt())
                .build();
    }
}

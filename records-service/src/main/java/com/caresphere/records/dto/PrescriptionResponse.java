package com.caresphere.records.dto;

import com.caresphere.records.entity.Prescription;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {

    private UUID id;
    private UUID visitId;
    private String status;
    private LocalDateTime createdAt;
    private List<MedicineResponse> medicines;

    public static PrescriptionResponse fromEntity(Prescription prescription) {
        List<MedicineResponse> medicineList = prescription.getMedicines().stream()
                .map(MedicineResponse::fromEntity)
                .collect(Collectors.toList());

        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .visitId(prescription.getVisit().getId())
                .status(prescription.getStatus().name())
                .createdAt(prescription.getCreatedAt())
                .medicines(medicineList)
                .build();
    }
}

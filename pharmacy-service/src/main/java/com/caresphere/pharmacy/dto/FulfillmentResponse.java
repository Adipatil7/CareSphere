package com.caresphere.pharmacy.dto;

import com.caresphere.pharmacy.entity.PrescriptionFulfillment;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FulfillmentResponse {

    private UUID id;
    private UUID prescriptionId;
    private UUID chemistId;
    private String status;
    private LocalDateTime updatedAt;

    public static FulfillmentResponse fromEntity(PrescriptionFulfillment entity) {
        return FulfillmentResponse.builder()
                .id(entity.getId())
                .prescriptionId(entity.getPrescriptionId())
                .chemistId(entity.getChemistId())
                .status(entity.getStatus().name())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

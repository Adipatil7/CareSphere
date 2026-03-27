package com.caresphere.records.dto;

import com.caresphere.records.entity.PrescriptionMedicine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineResponse {

    private UUID id;
    private String medicineName;
    private String dosage;
    private String duration;
    private String instructions;

    public static MedicineResponse fromEntity(PrescriptionMedicine medicine) {
        return MedicineResponse.builder()
                .id(medicine.getId())
                .medicineName(medicine.getMedicineName())
                .dosage(medicine.getDosage())
                .duration(medicine.getDuration())
                .instructions(medicine.getInstructions())
                .build();
    }
}

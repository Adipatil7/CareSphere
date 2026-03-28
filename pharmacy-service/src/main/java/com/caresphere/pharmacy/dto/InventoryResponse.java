package com.caresphere.pharmacy.dto;

import com.caresphere.pharmacy.entity.ChemistInventory;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private UUID id;
    private UUID chemistId;
    private String medicineName;
    private int quantity;
    private LocalDateTime lastUpdated;

    public static InventoryResponse fromEntity(ChemistInventory entity) {
        return InventoryResponse.builder()
                .id(entity.getId())
                .chemistId(entity.getChemistId())
                .medicineName(entity.getMedicine().getName())
                .quantity(entity.getQuantity())
                .lastUpdated(entity.getLastUpdated())
                .build();
    }
}

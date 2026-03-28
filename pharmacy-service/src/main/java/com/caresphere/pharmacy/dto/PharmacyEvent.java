package com.caresphere.pharmacy.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyEvent {

    private String prescriptionId;
    private String chemistId;
    private String status;
}

package com.caresphere.records.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordsEvent {

    private String visitId;
    private String patientId;
    private String doctorId;
}

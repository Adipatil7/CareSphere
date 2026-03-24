package com.caresphere.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSearchResponse {

    private UUID userId;
    private String licenseNumber;
    private String specialization;
    private int experienceYears;
    private String bio;
}

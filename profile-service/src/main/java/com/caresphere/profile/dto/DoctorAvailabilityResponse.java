package com.caresphere.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorAvailabilityResponse {

    private UUID id;
    private UUID doctorId;
    private int dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}

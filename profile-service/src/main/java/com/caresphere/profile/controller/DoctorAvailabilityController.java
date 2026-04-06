package com.caresphere.profile.controller;

import com.caresphere.profile.dto.DoctorAvailabilityRequest;
import com.caresphere.profile.dto.DoctorAvailabilityResponse;
import com.caresphere.profile.service.DoctorAvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    @PostMapping("/doctors/availability")
    public ResponseEntity<DoctorAvailabilityResponse> addAvailability(
            @Valid @RequestBody DoctorAvailabilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(availabilityService.addAvailability(request));
    }

    @GetMapping("/doctors/{doctorId}/availability")
    public ResponseEntity<List<DoctorAvailabilityResponse>> getAvailability(
            @PathVariable UUID doctorId) {
        return ResponseEntity.ok(availabilityService.getAvailabilityByDoctor(doctorId));
    }
}

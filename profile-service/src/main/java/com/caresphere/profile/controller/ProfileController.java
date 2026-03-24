package com.caresphere.profile.controller;

import com.caresphere.profile.dto.*;
import com.caresphere.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/profiles/{userId}")
    public ResponseEntity<Object> getProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping("/profiles/doctor/{userId}")
    public ResponseEntity<DoctorProfileResponse> updateDoctorProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateDoctorProfileRequest request) {
        return ResponseEntity.ok(profileService.updateDoctorProfile(userId, request));
    }

    @PutMapping("/profiles/chemist/{userId}")
    public ResponseEntity<ChemistProfileResponse> updateChemistProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateChemistProfileRequest request) {
        return ResponseEntity.ok(profileService.updateChemistProfile(userId, request));
    }

    @GetMapping("/doctors/search")
    public ResponseEntity<List<DoctorSearchResponse>> searchDoctors(
            @RequestParam String specialization) {
        return ResponseEntity.ok(profileService.searchDoctors(specialization));
    }
}

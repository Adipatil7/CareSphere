package com.caresphere.profile.service;

import com.caresphere.profile.dto.*;
import com.caresphere.profile.entity.ChemistProfile;
import com.caresphere.profile.entity.DoctorProfile;
import com.caresphere.profile.exception.ProfileNotFoundException;
import com.caresphere.profile.repository.ChemistProfileRepository;
import com.caresphere.profile.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final ChemistProfileRepository chemistProfileRepository;

    /**
     * Get profile by userId — checks both doctor and chemist repositories.
     */
    public Object getProfile(UUID userId) {
        Optional<DoctorProfile> doctorProfile = doctorProfileRepository.findById(userId);
        if (doctorProfile.isPresent()) {
            return toDoctorProfileResponse(doctorProfile.get());
        }

        Optional<ChemistProfile> chemistProfile = chemistProfileRepository.findById(userId);
        if (chemistProfile.isPresent()) {
            return toChemistProfileResponse(chemistProfile.get());
        }

        throw new ProfileNotFoundException("Profile not found for userId: " + userId);
    }

    /**
     * Update doctor profile fields.
     */
    @Transactional
    public DoctorProfileResponse updateDoctorProfile(UUID userId, UpdateDoctorProfileRequest request) {
        DoctorProfile profile = doctorProfileRepository.findById(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Doctor profile not found for userId: " + userId));

        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setSpecialization(request.getSpecialization());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setBio(request.getBio());

        profile = doctorProfileRepository.save(profile);
        log.info("Updated doctor profile for userId={}", userId);

        return toDoctorProfileResponse(profile);
    }

    /**
     * Update chemist profile fields.
     */
    @Transactional
    public ChemistProfileResponse updateChemistProfile(UUID userId, UpdateChemistProfileRequest request) {
        ChemistProfile profile = chemistProfileRepository.findById(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Chemist profile not found for userId: " + userId));

        profile.setPharmacyName(request.getPharmacyName());
        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setAddress(request.getAddress());

        profile = chemistProfileRepository.save(profile);
        log.info("Updated chemist profile for userId={}", userId);

        return toChemistProfileResponse(profile);
    }

    /**
     * Create an empty doctor profile (called from Kafka consumer).
     * Idempotent — skips if profile already exists.
     */
    @Transactional
    public void createDoctorProfile(UUID userId) {
        if (doctorProfileRepository.existsById(userId)) {
            log.info("Doctor profile already exists for userId={}, skipping creation", userId);
            return;
        }

        DoctorProfile profile = DoctorProfile.builder()
                .userId(userId)
                .build();

        doctorProfileRepository.save(profile);
        log.info("Created empty doctor profile for userId={}", userId);
    }

    /**
     * Create an empty chemist profile (called from Kafka consumer).
     * Idempotent — skips if profile already exists.
     */
    @Transactional
    public void createChemistProfile(UUID userId) {
        if (chemistProfileRepository.existsById(userId)) {
            log.info("Chemist profile already exists for userId={}, skipping creation", userId);
            return;
        }

        ChemistProfile profile = ChemistProfile.builder()
                .userId(userId)
                .build();

        chemistProfileRepository.save(profile);
        log.info("Created empty chemist profile for userId={}", userId);
    }

    /**
     * Search doctors by specialization.
     */
    public List<DoctorSearchResponse> searchDoctors(String specialization) {
        List<DoctorProfile> doctors = doctorProfileRepository
                .findBySpecializationContainingIgnoreCase(specialization);

        return doctors.stream()
                .map(this::toDoctorSearchResponse)
                .toList();
    }

    // ─── Mappers ────────────────────────────────────────────────────

    private DoctorProfileResponse toDoctorProfileResponse(DoctorProfile profile) {
        return DoctorProfileResponse.builder()
                .userId(profile.getUserId())
                .licenseNumber(profile.getLicenseNumber())
                .specialization(profile.getSpecialization())
                .experienceYears(profile.getExperienceYears())
                .bio(profile.getBio())
                .build();
    }

    private ChemistProfileResponse toChemistProfileResponse(ChemistProfile profile) {
        return ChemistProfileResponse.builder()
                .userId(profile.getUserId())
                .pharmacyName(profile.getPharmacyName())
                .licenseNumber(profile.getLicenseNumber())
                .address(profile.getAddress())
                .build();
    }

    private DoctorSearchResponse toDoctorSearchResponse(DoctorProfile profile) {
        return DoctorSearchResponse.builder()
                .userId(profile.getUserId())
                .licenseNumber(profile.getLicenseNumber())
                .specialization(profile.getSpecialization())
                .experienceYears(profile.getExperienceYears())
                .bio(profile.getBio())
                .build();
    }
}

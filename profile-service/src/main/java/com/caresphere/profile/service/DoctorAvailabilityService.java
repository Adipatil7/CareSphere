package com.caresphere.profile.service;

import com.caresphere.profile.dto.DoctorAvailabilityRequest;
import com.caresphere.profile.dto.DoctorAvailabilityResponse;
import com.caresphere.profile.entity.DoctorAvailability;
import com.caresphere.profile.exception.DoctorNotFoundException;
import com.caresphere.profile.repository.DoctorAvailabilityRepository;
import com.caresphere.profile.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorProfileRepository doctorProfileRepository;

    /**
     * Add a new availability slot for a doctor.
     * Validates that the doctor profile exists.
     */
    @Transactional
    public DoctorAvailabilityResponse addAvailability(DoctorAvailabilityRequest request) {
        if (!doctorProfileRepository.existsById(request.getDoctorId())) {
            throw new DoctorNotFoundException("Doctor profile not found for doctorId: " + request.getDoctorId());
        }

        DoctorAvailability availability = DoctorAvailability.builder()
                .doctorId(request.getDoctorId())
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        availability = availabilityRepository.save(availability);
        log.info("Added availability slot for doctorId={}", request.getDoctorId());

        return toResponse(availability);
    }

    /**
     * Get all availability slots for a doctor.
     */
    public List<DoctorAvailabilityResponse> getAvailabilityByDoctor(UUID doctorId) {
        if (!doctorProfileRepository.existsById(doctorId)) {
            throw new DoctorNotFoundException("Doctor profile not found for doctorId: " + doctorId);
        }

        return availabilityRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private DoctorAvailabilityResponse toResponse(DoctorAvailability availability) {
        return DoctorAvailabilityResponse.builder()
                .id(availability.getId())
                .doctorId(availability.getDoctorId())
                .dayOfWeek(availability.getDayOfWeek())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .build();
    }
}

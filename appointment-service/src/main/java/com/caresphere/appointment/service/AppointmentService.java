package com.caresphere.appointment.service;

import com.caresphere.appointment.dto.AppointmentResponse;
import com.caresphere.appointment.dto.CreateAppointmentRequest;
import com.caresphere.appointment.entity.Appointment;
import com.caresphere.appointment.entity.AppointmentStatus;
import com.caresphere.appointment.exception.AppointmentNotFoundException;
import com.caresphere.appointment.exception.InvalidStatusTransitionException;
import com.caresphere.appointment.exception.OverlappingAppointmentException;
import com.caresphere.appointment.kafka.AppointmentEventProducer;
import com.caresphere.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentEventProducer eventProducer;

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        // Validate no overlapping appointments for the doctor
        List<Appointment> overlapping = appointmentRepository.findOverlappingAppointments(
                request.getDoctorId(),
                request.getStartTime(),
                request.getEndTime(),
                AppointmentStatus.CANCELLED
        );

        if (!overlapping.isEmpty()) {
            throw new OverlappingAppointmentException(
                    "Doctor already has an appointment in the requested time slot");
        }

        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        log.info("Created appointment id={} for patient={} with doctor={}",
                saved.getId(), saved.getPatientId(), saved.getDoctorId());

        eventProducer.publishAppointmentCreated(saved);

        return AppointmentResponse.fromEntity(saved);
    }

    public AppointmentResponse getAppointmentById(UUID id) {
        Appointment appointment = findAppointmentOrThrow(id);
        return AppointmentResponse.fromEntity(appointment);
    }

    public List<AppointmentResponse> getAppointmentsByPatientId(UUID patientId) {
        return appointmentRepository.findByPatientIdOrderByStartTimeDesc(patientId)
                .stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByDoctorId(UUID doctorId) {
        return appointmentRepository.findByDoctorIdOrderByStartTimeDesc(doctorId)
                .stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse acceptAppointment(UUID id) {
        Appointment appointment = findAppointmentOrThrow(id);

        if (appointment.getStatus() != AppointmentStatus.REQUESTED) {
            throw new InvalidStatusTransitionException(
                    "Only REQUESTED appointments can be accepted. Current status: " + appointment.getStatus());
        }

        appointment.setStatus(AppointmentStatus.ACCEPTED);
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Accepted appointment id={}", saved.getId());

        eventProducer.publishAppointmentAccepted(saved);

        return AppointmentResponse.fromEntity(saved);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(UUID id) {
        Appointment appointment = findAppointmentOrThrow(id);

        if (appointment.getStatus() == AppointmentStatus.COMPLETED ||
                appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new InvalidStatusTransitionException(
                    "Cannot cancel an appointment with status: " + appointment.getStatus());
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Cancelled appointment id={}", saved.getId());

        eventProducer.publishAppointmentCancelled(saved);

        return AppointmentResponse.fromEntity(saved);
    }

    @Transactional
    public AppointmentResponse completeAppointment(UUID id) {
        Appointment appointment = findAppointmentOrThrow(id);

        if (appointment.getStatus() != AppointmentStatus.ACCEPTED) {
            throw new InvalidStatusTransitionException(
                    "Only ACCEPTED appointments can be completed. Current status: " + appointment.getStatus());
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Completed appointment id={}", saved.getId());

        eventProducer.publishAppointmentCompleted(saved);

        return AppointmentResponse.fromEntity(saved);
    }

    private Appointment findAppointmentOrThrow(UUID id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(
                        "Appointment not found with id: " + id));
    }
}

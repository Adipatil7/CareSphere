package com.caresphere.consultation.service;

import com.caresphere.consultation.dto.ConsultSessionResponse;
import com.caresphere.consultation.dto.StartConsultRequest;
import com.caresphere.consultation.entity.ConsultSession;
import com.caresphere.consultation.entity.SessionStatus;
import com.caresphere.consultation.exception.DuplicateSessionException;
import com.caresphere.consultation.exception.SessionNotFoundException;
import com.caresphere.consultation.kafka.ConsultEventProducer;
import com.caresphere.consultation.repository.ConsultSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultationService {

    private final ConsultSessionRepository sessionRepository;
    private final ConsultEventProducer eventProducer;

    private static final List<SessionStatus> ACTIVE_STATUSES =
            List.of(SessionStatus.CREATED, SessionStatus.ACTIVE);

    @Transactional
    public ConsultSessionResponse startConsultation(StartConsultRequest request) {
        // Only look for sessions that are still active (CREATED or ACTIVE), not ENDED ones
        Optional<ConsultSession> existingSession = sessionRepository
                .findByAppointmentIdAndStatusIn(request.getAppointmentId(), ACTIVE_STATUSES);

        if (existingSession.isPresent()) {
            ConsultSession session = existingSession.get();
            log.info("Returning existing active consultation session roomId={} for appointmentId={}",
                    session.getRoomId(), session.getAppointmentId());
            return ConsultSessionResponse.fromEntity(session);
        }

        // Create a new session (even if an ENDED one exists for the same appointment)
        ConsultSession session = ConsultSession.builder()
                .appointmentId(request.getAppointmentId())
                .roomId(UUID.randomUUID().toString())
                .doctorId(request.getDoctorId())
                .patientId(request.getPatientId())
                .build();

        ConsultSession saved = sessionRepository.save(session);
        log.info("Started consultation session id={} roomId={} for appointmentId={}",
                saved.getId(), saved.getRoomId(), saved.getAppointmentId());

        eventProducer.publishConsultStarted(saved);

        return ConsultSessionResponse.fromEntity(saved);
    }

    @Transactional
    public ConsultSessionResponse endConsultation(String roomId) {
        ConsultSession session = sessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new SessionNotFoundException(
                        "Consultation session not found with roomId: " + roomId));

        session.setStatus(SessionStatus.ENDED);
        session.setEndedAt(LocalDateTime.now());

        ConsultSession saved = sessionRepository.save(session);
        log.info("Ended consultation session id={} roomId={}", saved.getId(), saved.getRoomId());

        eventProducer.publishConsultEnded(saved);

        return ConsultSessionResponse.fromEntity(saved);
    }
}

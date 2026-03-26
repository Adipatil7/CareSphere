package com.caresphere.consultation.kafka;

import com.caresphere.consultation.entity.ConsultSession;
import com.caresphere.consultation.entity.SessionStatus;
import com.caresphere.consultation.repository.ConsultSessionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentEventConsumer {

    private final ConsultSessionRepository sessionRepository;
    private final ConsultEventProducer consultEventProducer;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "appointment.accepted", groupId = "consultation-service")
    public void handleAppointmentAccepted(String message) {
        try {
            JsonNode node = objectMapper.readTree(message);

            UUID appointmentId = UUID.fromString(node.get("appointmentId").asText());
            UUID doctorId = UUID.fromString(node.get("doctorId").asText());
            UUID patientId = UUID.fromString(node.get("patientId").asText());

            if (sessionRepository.existsByAppointmentId(appointmentId)) {
                log.info("Session already exists for appointmentId={}. Skipping auto-creation.", appointmentId);
                return;
            }

            ConsultSession session = ConsultSession.builder()
                    .appointmentId(appointmentId)
                    .roomId(UUID.randomUUID().toString())
                    .doctorId(doctorId)
                    .patientId(patientId)
                    .status(SessionStatus.CREATED)
                    .build();

            ConsultSession saved = sessionRepository.save(session);
            log.info("Auto-created consultation session id={} for appointmentId={}", saved.getId(), appointmentId);

            consultEventProducer.publishConsultStarted(saved);
        } catch (Exception e) {
            log.error("Failed to process appointment.accepted event: {}", e.getMessage(), e);
        }
    }
}

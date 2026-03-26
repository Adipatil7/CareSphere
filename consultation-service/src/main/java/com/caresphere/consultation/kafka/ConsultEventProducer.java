package com.caresphere.consultation.kafka;

import com.caresphere.consultation.dto.ConsultEvent;
import com.caresphere.consultation.entity.ConsultSession;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ConsultEventProducer {

    private static final String TOPIC_STARTED = "consult.started";
    private static final String TOPIC_ENDED = "consult.ended";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Async
    public void publishConsultStarted(ConsultSession session) {
        publish(TOPIC_STARTED, session);
    }

    @Async
    public void publishConsultEnded(ConsultSession session) {
        publish(TOPIC_ENDED, session);
    }

    private void publish(String topic, ConsultSession session) {
        try {
            ConsultEvent event = ConsultEvent.builder()
                    .consultId(session.getId().toString())
                    .appointmentId(session.getAppointmentId().toString())
                    .doctorId(session.getDoctorId().toString())
                    .patientId(session.getPatientId().toString())
                    .build();

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, session.getId().toString(), payload);
            log.info("Published {} event for consultId={}", topic, session.getId());
        } catch (Exception e) {
            log.warn("Failed to publish {} event for consultId={}. Kafka may not be ready: {}",
                    topic, session.getId(), e.getMessage());
        }
    }
}

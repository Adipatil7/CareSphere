package com.caresphere.records.kafka;

import com.caresphere.records.dto.RecordsEvent;
import com.caresphere.records.entity.Visit;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecordsEventProducer {

    private static final String TOPIC_VISIT_COMPLETED = "visit.completed";
    private static final String TOPIC_PRESCRIPTION_CREATED = "prescription.created";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Async
    public void publishVisitCompleted(Visit visit) {
        publish(TOPIC_VISIT_COMPLETED, visit);
    }

    @Async
    public void publishPrescriptionCreated(Visit visit) {
        publish(TOPIC_PRESCRIPTION_CREATED, visit);
    }

    private void publish(String topic, Visit visit) {
        try {
            RecordsEvent event = RecordsEvent.builder()
                    .visitId(visit.getId().toString())
                    .patientId(visit.getPatientId().toString())
                    .doctorId(visit.getDoctorId().toString())
                    .build();

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, visit.getId().toString(), payload);
            log.info("Published {} event for visitId={}", topic, visit.getId());
        } catch (Exception e) {
            log.warn("Failed to publish {} event for visitId={}. Kafka may not be ready: {}",
                    topic, visit.getId(), e.getMessage());
        }
    }
}

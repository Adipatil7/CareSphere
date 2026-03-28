package com.caresphere.pharmacy.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PrescriptionEventConsumer {

    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "prescription.created", groupId = "pharmacy-service")
    public void handlePrescriptionCreated(String message) {
        try {
            JsonNode node = objectMapper.readTree(message);
            log.info("Received prescription.created event: visitId={}, patientId={}, doctorId={}",
                    node.has("visitId") ? node.get("visitId").asText() : "N/A",
                    node.has("patientId") ? node.get("patientId").asText() : "N/A",
                    node.has("doctorId") ? node.get("doctorId").asText() : "N/A");
        } catch (Exception e) {
            log.error("Failed to process prescription.created event: {}", e.getMessage(), e);
        }
    }
}

package com.caresphere.records.kafka;

import com.caresphere.records.entity.Visit;
import com.caresphere.records.repository.VisitRepository;
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
public class ConsultEventConsumer {

    private final VisitRepository visitRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "consult.ended", groupId = "records-service")
    public void handleConsultEnded(String message) {
        try {
            JsonNode node = objectMapper.readTree(message);

            UUID consultId = UUID.fromString(node.get("consultId").asText());
            UUID doctorId = UUID.fromString(node.get("doctorId").asText());
            UUID patientId = UUID.fromString(node.get("patientId").asText());

            if (visitRepository.existsByConsultId(consultId)) {
                log.info("Visit already exists for consultId={}. Skipping auto-creation.", consultId);
                return;
            }

            Visit visit = Visit.builder()
                    .consultId(consultId)
                    .doctorId(doctorId)
                    .patientId(patientId)
                    .notes("")
                    .build();

            Visit saved = visitRepository.save(visit);
            log.info("Auto-created empty visit id={} for consultId={}", saved.getId(), consultId);
        } catch (Exception e) {
            log.error("Failed to process consult.ended event: {}", e.getMessage(), e);
        }
    }
}

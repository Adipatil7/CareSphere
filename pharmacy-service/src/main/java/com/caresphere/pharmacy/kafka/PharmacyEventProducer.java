package com.caresphere.pharmacy.kafka;

import com.caresphere.pharmacy.dto.PharmacyEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PharmacyEventProducer {

    private static final String TOPIC_PRESCRIPTION_FULFILLED = "prescription.fulfilled";
    private static final String TOPIC_STOCK_UPDATED = "medicine.stock.updated";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Async
    public void publishPrescriptionFulfilled(PharmacyEvent event) {
        publish(TOPIC_PRESCRIPTION_FULFILLED, event.getPrescriptionId(), event);
    }

    @Async
    public void publishStockUpdated(PharmacyEvent event) {
        publish(TOPIC_STOCK_UPDATED, event.getChemistId(), event);
    }

    private void publish(String topic, String key, PharmacyEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, key, payload);
            log.info("Published {} event: {}", topic, payload);
        } catch (Exception e) {
            log.warn("Failed to publish {} event. Kafka may not be ready: {}", topic, e.getMessage());
        }
    }
}

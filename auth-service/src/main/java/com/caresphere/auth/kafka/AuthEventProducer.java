package com.caresphere.auth.kafka;

import com.caresphere.auth.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventProducer {

    private static final String TOPIC_USER_CREATED = "user.created";
    private static final String TOPIC_USER_VERIFIED = "user.verified";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Async
    public void publishUserCreated(User user) {
        try {
            String payload = buildPayload(user);
            kafkaTemplate.send(TOPIC_USER_CREATED, user.getId().toString(), payload);
            log.info("Published user.created event for userId={}", user.getId());
        } catch (Exception e) {
            log.warn("Failed to publish user.created event for userId={}. Kafka may not be ready: {}",
                    user.getId(), e.getMessage());
        }
    }

    @Async
    public void publishUserVerified(User user) {
        try {
            String payload = buildPayload(user);
            kafkaTemplate.send(TOPIC_USER_VERIFIED, user.getId().toString(), payload);
            log.info("Published user.verified event for userId={}", user.getId());
        } catch (Exception e) {
            log.warn("Failed to publish user.verified event for userId={}. Kafka may not be ready: {}",
                    user.getId(), e.getMessage());
        }
    }

    private String buildPayload(User user) {
        try {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("userId", user.getId().toString());
            node.put("role", user.getRole().name());
            node.put("email", user.getEmail());
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            log.error("Failed to serialize event payload for userId={}", user.getId(), e);
            throw new RuntimeException("Failed to serialize event payload", e);
        }
    }
}

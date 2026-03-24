package com.caresphere.profile.kafka;

import com.caresphere.profile.dto.UserCreatedEvent;
import com.caresphere.profile.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserCreatedEventConsumer {

    private final ProfileService profileService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "user.created", groupId = "profile-service")
    public void consume(String message) {
        try {
            log.info("Received user.created event: {}", message);

            UserCreatedEvent event = objectMapper.readValue(message, UserCreatedEvent.class);
            UUID userId = UUID.fromString(event.getUserId());

            switch (event.getRole().toUpperCase()) {
                case "DOCTOR" -> {
                    profileService.createDoctorProfile(userId);
                    log.info("Created doctor profile for userId={}", userId);
                }
                case "CHEMIST" -> {
                    profileService.createChemistProfile(userId);
                    log.info("Created chemist profile for userId={}", userId);
                }
                case "PATIENT" -> log.info("Skipping profile creation for PATIENT userId={}", userId);
                default -> log.warn("Unknown role '{}' in user.created event for userId={}", event.getRole(), userId);
            }

        } catch (Exception e) {
            log.error("Failed to process user.created event: {}", message, e);
        }
    }
}

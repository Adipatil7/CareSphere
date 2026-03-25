package com.caresphere.appointment.kafka;

import com.caresphere.appointment.dto.AppointmentEvent;
import com.caresphere.appointment.entity.Appointment;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentEventProducer {

    private static final String TOPIC_CREATED = "appointment.created";
    private static final String TOPIC_ACCEPTED = "appointment.accepted";
    private static final String TOPIC_CANCELLED = "appointment.cancelled";
    private static final String TOPIC_COMPLETED = "appointment.completed";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Async
    public void publishAppointmentCreated(Appointment appointment) {
        publish(TOPIC_CREATED, appointment);
    }

    @Async
    public void publishAppointmentAccepted(Appointment appointment) {
        publish(TOPIC_ACCEPTED, appointment);
    }

    @Async
    public void publishAppointmentCancelled(Appointment appointment) {
        publish(TOPIC_CANCELLED, appointment);
    }

    @Async
    public void publishAppointmentCompleted(Appointment appointment) {
        publish(TOPIC_COMPLETED, appointment);
    }

    private void publish(String topic, Appointment appointment) {
        try {
            AppointmentEvent event = AppointmentEvent.builder()
                    .appointmentId(appointment.getId().toString())
                    .patientId(appointment.getPatientId().toString())
                    .doctorId(appointment.getDoctorId().toString())
                    .status(appointment.getStatus().name())
                    .startTime(appointment.getStartTime().toString())
                    .build();

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, appointment.getId().toString(), payload);
            log.info("Published {} event for appointmentId={}", topic, appointment.getId());
        } catch (Exception e) {
            log.warn("Failed to publish {} event for appointmentId={}. Kafka may not be ready: {}",
                    topic, appointment.getId(), e.getMessage());
        }
    }
}

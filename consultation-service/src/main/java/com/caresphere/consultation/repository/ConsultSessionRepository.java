package com.caresphere.consultation.repository;

import com.caresphere.consultation.entity.ConsultSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConsultSessionRepository extends JpaRepository<ConsultSession, UUID> {

    Optional<ConsultSession> findByRoomId(String roomId);

    Optional<ConsultSession> findByAppointmentId(UUID appointmentId);

    boolean existsByAppointmentId(UUID appointmentId);
}

package com.caresphere.consultation.repository;

import com.caresphere.consultation.entity.ConsultSession;
import com.caresphere.consultation.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConsultSessionRepository extends JpaRepository<ConsultSession, UUID> {

    Optional<ConsultSession> findByRoomId(String roomId);

    Optional<ConsultSession> findByAppointmentId(UUID appointmentId);

    Optional<ConsultSession> findByAppointmentIdAndStatusIn(UUID appointmentId, List<SessionStatus> statuses);

    boolean existsByAppointmentId(UUID appointmentId);
}

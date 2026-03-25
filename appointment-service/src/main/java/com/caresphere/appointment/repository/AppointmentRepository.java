package com.caresphere.appointment.repository;

import com.caresphere.appointment.entity.Appointment;
import com.caresphere.appointment.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByPatientIdOrderByStartTimeDesc(UUID patientId);

    List<Appointment> findByDoctorIdOrderByStartTimeDesc(UUID doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId " +
            "AND a.status <> :excludedStatus " +
            "AND a.startTime < :endTime " +
            "AND a.endTime > :startTime")
    List<Appointment> findOverlappingAppointments(
            @Param("doctorId") UUID doctorId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludedStatus") AppointmentStatus excludedStatus
    );
}

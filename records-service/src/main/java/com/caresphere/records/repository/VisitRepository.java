package com.caresphere.records.repository;

import com.caresphere.records.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VisitRepository extends JpaRepository<Visit, UUID> {

    List<Visit> findByPatientIdOrderByCreatedAtDesc(UUID patientId);

    Optional<Visit> findByConsultId(UUID consultId);

    boolean existsByConsultId(UUID consultId);
}

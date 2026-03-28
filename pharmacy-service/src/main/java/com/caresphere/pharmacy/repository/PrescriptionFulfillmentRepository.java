package com.caresphere.pharmacy.repository;

import com.caresphere.pharmacy.entity.PrescriptionFulfillment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PrescriptionFulfillmentRepository extends JpaRepository<PrescriptionFulfillment, UUID> {

    Optional<PrescriptionFulfillment> findByPrescriptionId(UUID prescriptionId);
}

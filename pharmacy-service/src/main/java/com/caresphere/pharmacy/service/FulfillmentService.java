package com.caresphere.pharmacy.service;

import com.caresphere.pharmacy.dto.FulfillmentResponse;
import com.caresphere.pharmacy.dto.PharmacyEvent;
import com.caresphere.pharmacy.entity.FulfillmentStatus;
import com.caresphere.pharmacy.entity.PrescriptionFulfillment;
import com.caresphere.pharmacy.exception.FulfillmentNotFoundException;
import com.caresphere.pharmacy.kafka.PharmacyEventProducer;
import com.caresphere.pharmacy.repository.PrescriptionFulfillmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FulfillmentService {

    private final PrescriptionFulfillmentRepository fulfillmentRepository;
    private final PharmacyEventProducer eventProducer;

    @Transactional
    public FulfillmentResponse fulfillPrescription(UUID prescriptionId, UUID chemistId) {
        PrescriptionFulfillment fulfillment = fulfillmentRepository
                .findByPrescriptionId(prescriptionId)
                .map(existing -> {
                    existing.setStatus(FulfillmentStatus.FULFILLED);
                    existing.setChemistId(chemistId);
                    return existing;
                })
                .orElseGet(() -> PrescriptionFulfillment.builder()
                        .prescriptionId(prescriptionId)
                        .chemistId(chemistId)
                        .status(FulfillmentStatus.FULFILLED)
                        .build());

        PrescriptionFulfillment saved = fulfillmentRepository.save(fulfillment);
        log.info("Prescription fulfilled: prescriptionId={}, chemistId={}", prescriptionId, chemistId);

        PharmacyEvent event = PharmacyEvent.builder()
                .prescriptionId(prescriptionId.toString())
                .chemistId(chemistId.toString())
                .status("FULFILLED")
                .build();
        eventProducer.publishPrescriptionFulfilled(event);

        return FulfillmentResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public FulfillmentResponse getStatus(UUID prescriptionId) {
        PrescriptionFulfillment fulfillment = fulfillmentRepository
                .findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new FulfillmentNotFoundException(
                        "Fulfillment not found for prescriptionId: " + prescriptionId));

        return FulfillmentResponse.fromEntity(fulfillment);
    }
}

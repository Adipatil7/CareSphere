package com.caresphere.records.service;

import com.caresphere.records.dto.CreatePrescriptionRequest;
import com.caresphere.records.dto.MedicineRequest;
import com.caresphere.records.dto.PrescriptionResponse;
import com.caresphere.records.entity.Prescription;
import com.caresphere.records.entity.PrescriptionMedicine;
import com.caresphere.records.entity.PrescriptionStatus;
import com.caresphere.records.entity.Visit;
import com.caresphere.records.exception.PrescriptionNotFoundException;
import com.caresphere.records.exception.VisitNotFoundException;
import com.caresphere.records.kafka.RecordsEventProducer;
import com.caresphere.records.repository.PrescriptionRepository;
import com.caresphere.records.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final VisitRepository visitRepository;
    private final RecordsEventProducer eventProducer;

    @Transactional
    public PrescriptionResponse createPrescription(CreatePrescriptionRequest request) {
        Visit visit = visitRepository.findById(request.getVisitId())
                .orElseThrow(() -> new VisitNotFoundException(
                        "Visit not found with id: " + request.getVisitId()));

        Prescription prescription = Prescription.builder()
                .visit(visit)
                .status(PrescriptionStatus.CREATED)
                .build();

        List<PrescriptionMedicine> medicines = request.getMedicines().stream()
                .map(med -> PrescriptionMedicine.builder()
                        .prescription(prescription)
                        .medicineName(med.getName())
                        .dosage(med.getDosage())
                        .duration(med.getDuration())
                        .instructions(med.getInstructions())
                        .build())
                .toList();

        prescription.setMedicines(medicines);

        Prescription saved = prescriptionRepository.save(prescription);
        log.info("Created prescription id={} for visitId={}", saved.getId(), visit.getId());

        eventProducer.publishPrescriptionCreated(visit);

        return PrescriptionResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getPrescription(UUID id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new PrescriptionNotFoundException(
                        "Prescription not found with id: " + id));

        return PrescriptionResponse.fromEntity(prescription);
    }
}

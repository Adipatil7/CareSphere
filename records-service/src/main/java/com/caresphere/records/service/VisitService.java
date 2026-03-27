package com.caresphere.records.service;

import com.caresphere.records.dto.CreateVisitRequest;
import com.caresphere.records.dto.VisitResponse;
import com.caresphere.records.entity.Visit;
import com.caresphere.records.exception.DuplicateVisitException;
import com.caresphere.records.kafka.RecordsEventProducer;
import com.caresphere.records.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitService {

    private final VisitRepository visitRepository;
    private final RecordsEventProducer eventProducer;

    @Transactional
    public VisitResponse createVisit(CreateVisitRequest request) {
        // Enforce one visit per consultation
        if (visitRepository.existsByConsultId(request.getConsultId())) {
            throw new DuplicateVisitException(
                    "A visit record already exists for consultId: " + request.getConsultId());
        }

        Visit visit = Visit.builder()
                .consultId(request.getConsultId())
                .doctorId(request.getDoctorId())
                .patientId(request.getPatientId())
                .notes(request.getNotes())
                .build();

        Visit saved = visitRepository.save(visit);
        log.info("Created visit id={} for consultId={}", saved.getId(), saved.getConsultId());

        eventProducer.publishVisitCompleted(saved);

        return VisitResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<VisitResponse> getPatientRecords(UUID patientId) {
        return visitRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(VisitResponse::fromEntity)
                .collect(Collectors.toList());
    }
}

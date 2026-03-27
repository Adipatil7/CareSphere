package com.caresphere.records.controller;

import com.caresphere.records.dto.CreateVisitRequest;
import com.caresphere.records.dto.VisitResponse;
import com.caresphere.records.service.VisitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class VisitController {

    private final VisitService visitService;

    @PostMapping("/visits")
    public ResponseEntity<VisitResponse> createVisit(@Valid @RequestBody CreateVisitRequest request) {
        VisitResponse response = visitService.createVisit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/patients/{patientId}/records")
    public ResponseEntity<List<VisitResponse>> getPatientRecords(@PathVariable UUID patientId) {
        List<VisitResponse> records = visitService.getPatientRecords(patientId);
        return ResponseEntity.ok(records);
    }
}

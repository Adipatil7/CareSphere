package com.caresphere.records.controller;

import com.caresphere.records.dto.CreatePrescriptionRequest;
import com.caresphere.records.dto.PrescriptionResponse;
import com.caresphere.records.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping("/prescriptions")
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @Valid @RequestBody CreatePrescriptionRequest request) {
        PrescriptionResponse response = prescriptionService.createPrescription(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/prescriptions/{id}")
    public ResponseEntity<PrescriptionResponse> getPrescription(@PathVariable UUID id) {
        PrescriptionResponse response = prescriptionService.getPrescription(id);
        return ResponseEntity.ok(response);
    }
}

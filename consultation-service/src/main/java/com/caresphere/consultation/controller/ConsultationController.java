package com.caresphere.consultation.controller;

import com.caresphere.consultation.dto.ConsultSessionResponse;
import com.caresphere.consultation.dto.StartConsultRequest;
import com.caresphere.consultation.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping("/start")
    public ResponseEntity<ConsultSessionResponse> startConsultation(
            @Valid @RequestBody StartConsultRequest request) {
        ConsultSessionResponse response = consultationService.startConsultation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/end/{roomId}")
    public ResponseEntity<ConsultSessionResponse> endConsultation(@PathVariable String roomId) {
        ConsultSessionResponse response = consultationService.endConsultation(roomId);
        return ResponseEntity.ok(response);
    }
}

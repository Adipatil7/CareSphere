package com.caresphere.pharmacy.controller;

import com.caresphere.pharmacy.dto.FulfillmentResponse;
import com.caresphere.pharmacy.service.FulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class FulfillmentController {

    private final FulfillmentService fulfillmentService;

    @PostMapping("/prescriptions/{id}/fulfill")
    public ResponseEntity<FulfillmentResponse> fulfillPrescription(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        UUID chemistId = UUID.fromString(body.get("chemistId"));
        FulfillmentResponse response = fulfillmentService.fulfillPrescription(id, chemistId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/prescriptions/{id}/status")
    public ResponseEntity<FulfillmentResponse> getStatus(@PathVariable UUID id) {
        FulfillmentResponse response = fulfillmentService.getStatus(id);
        return ResponseEntity.ok(response);
    }
}

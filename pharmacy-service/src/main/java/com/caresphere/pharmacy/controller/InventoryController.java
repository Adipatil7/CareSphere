package com.caresphere.pharmacy.controller;

import com.caresphere.pharmacy.dto.AddInventoryRequest;
import com.caresphere.pharmacy.dto.InventoryResponse;
import com.caresphere.pharmacy.dto.UpdateInventoryRequest;
import com.caresphere.pharmacy.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/inventory")
    public ResponseEntity<InventoryResponse> addInventory(
            @Valid @RequestBody AddInventoryRequest request) {
        InventoryResponse response = inventoryService.addInventory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/inventory/update")
    public ResponseEntity<InventoryResponse> updateInventory(
            @Valid @RequestBody UpdateInventoryRequest request) {
        InventoryResponse response = inventoryService.updateInventory(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/inventory/chemist/{chemistId}")
    public ResponseEntity<List<InventoryResponse>> getChemistInventory(
            @PathVariable UUID chemistId) {
        List<InventoryResponse> responses = inventoryService.getInventoryByChemistId(chemistId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/inventory/{medicineName}")
    public ResponseEntity<List<InventoryResponse>> checkAvailability(
            @PathVariable String medicineName) {
        List<InventoryResponse> responses = inventoryService.checkAvailability(medicineName);
        return ResponseEntity.ok(responses);
    }
}

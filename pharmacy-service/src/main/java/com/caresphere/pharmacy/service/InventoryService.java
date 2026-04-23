package com.caresphere.pharmacy.service;

import com.caresphere.pharmacy.dto.AddInventoryRequest;
import com.caresphere.pharmacy.dto.InventoryResponse;
import com.caresphere.pharmacy.dto.PharmacyEvent;
import com.caresphere.pharmacy.dto.UpdateInventoryRequest;
import com.caresphere.pharmacy.entity.ChemistInventory;
import com.caresphere.pharmacy.entity.Medicine;
import com.caresphere.pharmacy.exception.InventoryNotFoundException;
import com.caresphere.pharmacy.exception.MedicineNotFoundException;
import com.caresphere.pharmacy.kafka.PharmacyEventProducer;
import com.caresphere.pharmacy.repository.ChemistInventoryRepository;
import com.caresphere.pharmacy.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

        private final MedicineRepository medicineRepository;
        private final ChemistInventoryRepository inventoryRepository;
        private final PharmacyEventProducer eventProducer;

        @Transactional
        public InventoryResponse addInventory(AddInventoryRequest request) {
                String normalizedName = request.getMedicineName().trim().toLowerCase();

                Medicine medicine = medicineRepository.findByName(normalizedName)
                                .orElseGet(() -> {
                                        Medicine newMedicine = Medicine.builder()
                                                        .name(normalizedName)
                                                        .build();
                                        return medicineRepository.save(newMedicine);
                                });

                ChemistInventory inventory = inventoryRepository
                                .findByChemistIdAndMedicine(request.getChemistId(), medicine)
                                .map(existing -> {
                                        existing.setQuantity(existing.getQuantity() + request.getQuantity());
                                        return existing;
                                })
                                .orElseGet(() -> ChemistInventory.builder()
                                                .chemistId(request.getChemistId())
                                                .medicine(medicine)
                                                .quantity(request.getQuantity())
                                                .build());

                ChemistInventory saved = inventoryRepository.save(inventory);
                log.info("Inventory updated: chemistId={}, medicine={}, quantity={}",
                                saved.getChemistId(), medicine.getName(), saved.getQuantity());

                publishStockEvent(saved);

                return InventoryResponse.fromEntity(saved);
        }

        @Transactional
        public InventoryResponse updateInventory(UpdateInventoryRequest request) {
                String normalizedName = request.getMedicineName().trim().toLowerCase();

                Medicine medicine = medicineRepository.findByName(normalizedName)
                                .orElseThrow(() -> new MedicineNotFoundException(
                                                "Medicine not found: " + request.getMedicineName()));

                ChemistInventory inventory = inventoryRepository
                                .findByChemistIdAndMedicine(request.getChemistId(), medicine)
                                .orElseThrow(() -> new InventoryNotFoundException(
                                                "Inventory not found for chemistId=" + request.getChemistId()
                                                                + " and medicine=" + normalizedName));

                inventory.setQuantity(request.getQuantity());
                ChemistInventory saved = inventoryRepository.save(inventory);
                log.info("Stock updated: chemistId={}, medicine={}, newQuantity={}",
                                saved.getChemistId(), medicine.getName(), saved.getQuantity());

                publishStockEvent(saved);

                return InventoryResponse.fromEntity(saved);
        }

        @Transactional(readOnly = true)
        public List<InventoryResponse> checkAvailability(String medicineName) {
                String normalizedName = medicineName.trim().toLowerCase();
                List<ChemistInventory> inventories = inventoryRepository.findAllByMedicineName(normalizedName);
                return inventories.stream()
                                .map(InventoryResponse::fromEntity)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<InventoryResponse> getInventoryByChemistId(UUID chemistId) {
                List<ChemistInventory> inventories = inventoryRepository.findByChemistId(chemistId);
                return inventories.stream()
                                .map(InventoryResponse::fromEntity)
                                .toList();
        }

        private void publishStockEvent(ChemistInventory inventory) {
                PharmacyEvent event = PharmacyEvent.builder()
                                .chemistId(inventory.getChemistId().toString())
                                .status("STOCK_UPDATED")
                                .build();
                eventProducer.publishStockUpdated(event);
        }
}

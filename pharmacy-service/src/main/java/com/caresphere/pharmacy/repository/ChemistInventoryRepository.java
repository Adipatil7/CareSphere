package com.caresphere.pharmacy.repository;

import com.caresphere.pharmacy.entity.ChemistInventory;
import com.caresphere.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChemistInventoryRepository extends JpaRepository<ChemistInventory, UUID> {

    Optional<ChemistInventory> findByChemistIdAndMedicine(UUID chemistId, Medicine medicine);

    @Query("SELECT ci FROM ChemistInventory ci JOIN ci.medicine m WHERE LOWER(m.name) = LOWER(:medicineName)")
    List<ChemistInventory> findAllByMedicineName(@Param("medicineName") String medicineName);
}

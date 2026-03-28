package com.caresphere.pharmacy.repository;

import com.caresphere.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MedicineRepository extends JpaRepository<Medicine, UUID> {

    Optional<Medicine> findByName(String name);
}

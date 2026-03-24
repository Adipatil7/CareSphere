package com.caresphere.profile.repository;

import com.caresphere.profile.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, UUID> {

    List<DoctorProfile> findBySpecializationContainingIgnoreCase(String specialization);
}

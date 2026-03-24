package com.caresphere.profile.repository;

import com.caresphere.profile.entity.ChemistProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChemistProfileRepository extends JpaRepository<ChemistProfile, UUID> {
}

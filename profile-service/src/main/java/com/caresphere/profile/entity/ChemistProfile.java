package com.caresphere.profile.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "chemist_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChemistProfile {

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Column(name = "pharmacy_name")
    private String pharmacyName;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
}

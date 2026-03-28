package com.caresphere.pharmacy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @PrePersist
    @PreUpdate
    protected void normalizeName() {
        if (this.name != null) {
            this.name = this.name.trim().toLowerCase();
        }
    }
}

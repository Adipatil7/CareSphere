package com.caresphere.pharmacy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prescription_fulfillments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionFulfillment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "prescription_id", nullable = false)
    private UUID prescriptionId;

    @Column(name = "chemist_id", nullable = false)
    private UUID chemistId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FulfillmentStatus status;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = FulfillmentStatus.AVAILABLE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

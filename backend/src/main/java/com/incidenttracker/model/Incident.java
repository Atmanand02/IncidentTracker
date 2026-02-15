package com.incidenttracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

@Table(name = "incidents", indexes = {
    @Index(name = "idx_incident_service", columnList = "service"),
    @Index(name = "idx_incident_severity", columnList = "severity"),
    @Index(name = "idx_incident_status", columnList = "status"),
    @Index(name = "idx_incident_created_at", columnList = "created_at")
})
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String service;

    @Column(nullable = false, length = 10)
    private String severity;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(length = 255)
    private String owner;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

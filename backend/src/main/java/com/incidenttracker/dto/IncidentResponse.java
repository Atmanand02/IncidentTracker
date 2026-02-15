package com.incidenttracker.dto;

import com.incidenttracker.model.Incident;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncidentResponse {

    private UUID id;
    private String title;
    private String service;
    private String severity;
    private String status;
    private String owner;
    private String summary;
    private String createdAt;
    private String updatedAt;

    public static IncidentResponse fromEntity(Incident entity) {
        IncidentResponse dto = new IncidentResponse();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setService(entity.getService());
        dto.setSeverity(entity.getSeverity());
        dto.setStatus(entity.getStatus());
        dto.setOwner(entity.getOwner());
        dto.setSummary(entity.getSummary());
        dto.setCreatedAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null);
        dto.setUpdatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null);
        return dto;
    }
}

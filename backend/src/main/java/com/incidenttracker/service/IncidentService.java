package com.incidenttracker.service;

import com.incidenttracker.dto.CreateIncidentRequest;
import com.incidenttracker.dto.IncidentResponse;
import com.incidenttracker.dto.UpdateIncidentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IncidentService {

    Page<IncidentResponse> findAllFiltered(
        Pageable pageable,
        String service,
        String severity,
        String status,
        String search
    );

    long countFiltered(String service, String severity, String status, String search);

    Optional<IncidentResponse> findById(UUID id);

    IncidentResponse create(CreateIncidentRequest request);

    Optional<IncidentResponse> update(UUID id, UpdateIncidentRequest request);
}

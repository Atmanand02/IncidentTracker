package com.incidenttracker.service;

import com.incidenttracker.dto.CreateIncidentRequest;
import com.incidenttracker.dto.IncidentResponse;
import com.incidenttracker.dto.UpdateIncidentRequest;
import com.incidenttracker.model.Incident;
import com.incidenttracker.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository repository;

    private static final List<String> ALL_SEVERITIES = List.of("SEV1", "SEV2", "SEV3", "SEV4");

    private static List<String> parseSeverityList(String severity) {
        if (severity == null || severity.isBlank()) {
            return ALL_SEVERITIES; // no filter => match all
        }
        return Arrays.stream(severity.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IncidentResponse> findAllFiltered(
            Pageable pageable,
            String service,
            String severity,
            String status,
            String search
    ) {
        List<String> severityList = parseSeverityList(severity);
        String searchNorm = (search != null && search.isBlank()) ? null : search;
        String serviceNorm = (service != null && service.isBlank()) ? null : service;
        String statusNorm = (status != null && status.isBlank()) ? null : status;
        return repository.findAllFiltered(serviceNorm, severityList, statusNorm, searchNorm, pageable)
                .map(IncidentResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public long countFiltered(String service, String severity, String status, String search) {
        List<String> severityList = parseSeverityList(severity);
        String searchNorm = (search != null && search.isBlank()) ? null : search;
        String serviceNorm = (service != null && service.isBlank()) ? null : service;
        String statusNorm = (status != null && status.isBlank()) ? null : status;
        return repository.countFiltered(serviceNorm, severityList, statusNorm, searchNorm);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IncidentResponse> findById(UUID id) {
        return repository.findById(id).map(IncidentResponse::fromEntity);
    }

    @Override
    @Transactional
    public IncidentResponse create(CreateIncidentRequest request) {
        Instant now = Instant.now();
        Incident entity = new Incident();
        entity.setTitle(request.getTitle().trim());
        entity.setService(request.getService().trim());
        entity.setSeverity(request.getSeverity());
        entity.setStatus(request.getStatus());
        entity.setOwner(request.getOwner() != null && !request.getOwner().isBlank() ? request.getOwner().trim() : null);
        entity.setSummary(request.getSummary() != null && !request.getSummary().isBlank() ? request.getSummary().trim() : null);
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);
        entity = repository.save(entity);
        return IncidentResponse.fromEntity(entity);
    }

    @Override
    @Transactional
    public Optional<IncidentResponse> update(UUID id, UpdateIncidentRequest request) {
        return repository.findById(id)
                .map(entity -> {
                    if (request.getSeverity() != null) entity.setSeverity(request.getSeverity());
                    if (request.getStatus() != null) entity.setStatus(request.getStatus());
                    if (request.getOwner() != null) entity.setOwner(request.getOwner().trim().isEmpty() ? null : request.getOwner().trim());
                    if (request.getSummary() != null) entity.setSummary(request.getSummary().trim().isEmpty() ? null : request.getSummary().trim());
                    entity.setUpdatedAt(Instant.now());
                    return repository.save(entity);
                })
                .map(IncidentResponse::fromEntity);
    }
}

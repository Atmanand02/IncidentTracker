package com.incidenttracker.controller;

import com.incidenttracker.dto.CreateIncidentRequest;
import com.incidenttracker.dto.IncidentResponse;
import com.incidenttracker.dto.UpdateIncidentRequest;
import com.incidenttracker.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/incidents")
public class IncidentController {

    private static final List<String> ALLOWED_SORT_FIELDS = List.of(
            "title", "service", "severity", "status", "createdAt", "owner", "updatedAt"
    );

    private final IncidentService incidentService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder
    ) {
        int safePage = Math.max(0, page - 1);
        int safeLimit = Math.min(100, Math.max(1, limit));
        String direction = "asc".equalsIgnoreCase(sortOrder) ? "asc" : "desc";
        String field = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort sort = Sort.by(Sort.Direction.fromString(direction), field);
        Pageable pageable = PageRequest.of(safePage, safeLimit, sort);

        var result = incidentService.findAllFiltered(pageable, service, severity, status, search);
        long total = incidentService.countFiltered(service, severity, status, search);

        return ResponseEntity.ok(Map.of(
                "data", result.getContent(),
                "total", total
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getById(@PathVariable UUID id) {
        return incidentService.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> create(@Valid @RequestBody CreateIncidentRequest request) {
        IncidentResponse created = incidentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<IncidentResponse> update(@PathVariable UUID id,
            @Valid @RequestBody UpdateIncidentRequest request) {
        Optional<IncidentResponse> updated = incidentService.update(id, request);
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}

package com.incidenttracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateIncidentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Service is required")
    private String service;

    @NotBlank(message = "Severity is required")
    @Pattern(regexp = "SEV[1-4]", message = "Severity must be SEV1, SEV2, SEV3, or SEV4")
    private String severity;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "OPEN|MITIGATED|RESOLVED", message = "Status must be OPEN, MITIGATED, or RESOLVED")
    private String status;

    private String owner;
    private String summary;
}

package com.incidenttracker.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateIncidentRequest {

    @Pattern(regexp = "SEV[1-4]", message = "Severity must be SEV1, SEV2, SEV3, or SEV4")
    private String severity;

    @Pattern(regexp = "OPEN|MITIGATED|RESOLVED", message = "Status must be OPEN, MITIGATED, or RESOLVED")
    private String status;

    private String owner;
    private String summary;
}

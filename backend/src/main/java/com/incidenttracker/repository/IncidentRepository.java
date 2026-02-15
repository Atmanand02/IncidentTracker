package com.incidenttracker.repository;

import com.incidenttracker.model.Incident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface IncidentRepository extends JpaRepository<Incident, UUID> {

    @Query("""
        SELECT i FROM Incident i WHERE
        (:service IS NULL OR :service = '' OR i.service = :service) AND
        i.severity IN :severityList AND
        (:status IS NULL OR :status = '' OR i.status = :status) AND
        (:search IS NULL OR :search = '' OR LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(COALESCE(i.summary, '')) LIKE LOWER(CONCAT('%', :search, '%'))
            OR (i.owner IS NOT NULL AND LOWER(i.owner) LIKE LOWER(CONCAT('%', :search, '%'))))
        """)
    Page<Incident> findAllFiltered(
        @Param("service") String service,
        @Param("severityList") List<String> severityList,
        @Param("status") String status,
        @Param("search") String search,
        Pageable pageable
    );

    @Query("""
        SELECT COUNT(i) FROM Incident i WHERE
        (:service IS NULL OR :service = '' OR i.service = :service) AND
        i.severity IN :severityList AND
        (:status IS NULL OR :status = '' OR i.status = :status) AND
        (:search IS NULL OR :search = '' OR LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(COALESCE(i.summary, '')) LIKE LOWER(CONCAT('%', :search, '%'))
            OR (i.owner IS NOT NULL AND LOWER(i.owner) LIKE LOWER(CONCAT('%', :search, '%'))))
        """)
    long countFiltered(
        @Param("service") String service,
        @Param("severityList") List<String> severityList,
        @Param("status") String status,
        @Param("search") String search
    );
}

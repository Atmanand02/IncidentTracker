package com.incidenttracker.seed;

import com.incidenttracker.model.Incident;
import com.incidenttracker.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Random;

@Component
public class IncidentSeeder implements CommandLineRunner {

    private static final String[] TITLES = {
            "Login Failure", "Payment Delay", "API Timeout", "UI Bug on Dashboard", "Database Issue",
            "Cache Miss", "Memory Leak", "Connection Pool Exhausted", "SSL Handshake Failed", "Rate Limit Exceeded",
            "Session Expiry", "Checkout Error", "Gateway Timeout", "Component Crash", "Replication Lag",
            "Auth Token Invalid", "Refund Failure", "Service Unavailable", "Blank Screen", "Deadlock Detected",
            "OAuth Redirect Broken", "Payout Delay", "Load Balancer Down", "Infinite Loop", "Index Corruption"
    };

    private static final String[] SUMMARIES = {
            "Users reported issues accessing the feature.",
            "Intermittent failures under load.",
            "Root cause under investigation.",
            "Fix deployed to production.",
            "Monitoring for recurrence."
    };

    private static final String[] SERVICES = {"Auth", "Payments", "Backend", "Frontend", "Database"};
    private static final String[] SEVERITIES = {"SEV1", "SEV2", "SEV3", "SEV4"};
    private static final String[] STATUSES = {"OPEN", "MITIGATED", "RESOLVED"};

    private final IncidentRepository repository;
    private final boolean seedEnabled;
    private final Random random = new Random(42);

    public IncidentSeeder(
            IncidentRepository repository,
            @Value("${app.seed.enabled:true}") boolean seedEnabled
    ) {
        this.repository = repository;
        this.seedEnabled = seedEnabled;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled || repository.count() > 0) {
            return;
        }
        int target = 200;
        Instant baseTime = Instant.now().minusSeconds(60L * 60 * 24 * 90);
        for (int i = 0; i < target; i++) {
            Incident inc = new Incident();
            inc.setTitle(TITLES[random.nextInt(TITLES.length)]);
            inc.setService(SERVICES[random.nextInt(SERVICES.length)]);
            inc.setSeverity(SEVERITIES[random.nextInt(SEVERITIES.length)]);
            inc.setStatus(STATUSES[random.nextInt(STATUSES.length)]);
            inc.setOwner(random.nextInt(5) != 0 ? "user-" + random.nextInt(5) + "@team" : null);
            inc.setSummary(random.nextInt(3) != 0 ? SUMMARIES[random.nextInt(SUMMARIES.length)] : null);
            long offsetSeconds = random.nextInt(60 * 60 * 24 * 60);
            Instant created = baseTime.plusSeconds(offsetSeconds);
            inc.setCreatedAt(created);
            inc.setUpdatedAt(Instant.now());
            repository.save(inc);
        }
    }
}

import { useState, useEffect, useCallback } from 'react';
import { SEVERITIES, STATUSES, SERVICES } from '../lib/constants';

const DEBOUNCE_MS = 350;

export default function Filters({
  service,
  severity,
  status,
  search,
  onServiceChange,
  onSeverityChange,
  onStatusChange,
  onSearchChange,
  onFilterClick,
}) {
  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    setLocalSearch(search || '');
  }, [search]);

  const debouncedSearch = useCallback(
    (value) => {
      const t = setTimeout(() => {
        onSearchChange(value);
      }, DEBOUNCE_MS);
      return () => clearTimeout(t);
    },
    [onSearchChange]
  );

  useEffect(() => {
    const clear = debouncedSearch(localSearch);
    return clear;
  }, [localSearch, debouncedSearch]);

  const severityList = severity ? severity.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const toggleSeverity = (sev) => {
    const set = new Set(severityList);
    if (set.has(sev)) set.delete(sev);
    else set.add(sev);
    onSeverityChange([...set].join(','));
  };

  return (
    <div className="filters">
      <div className="filters-row">
        <label htmlFor="filter-service" className="filter-label">
          Service
        </label>
        <select
          id="filter-service"
          value={service || ''}
          onChange={(e) => onServiceChange(e.target.value || undefined)}
          aria-label="Filter by service"
        >
          <option value="">All</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <fieldset className="filter-severity" aria-label="Filter by severity">
          <legend className="filter-legend">Severity</legend>
          {SEVERITIES.map((sev) => (
            <label key={sev} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={severityList.includes(sev)}
                onChange={() => toggleSeverity(sev)}
              />
              {sev}
            </label>
          ))}
        </fieldset>

        <label htmlFor="filter-status" className="filter-label">
          Status
        </label>
        <select
          id="filter-status"
          value={status || ''}
          onChange={(e) => onStatusChange(e.target.value || undefined)}
          aria-label="Filter by status"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label htmlFor="filter-search" className="filter-label visually-hidden">
          Search
        </label>
        <input
          id="filter-search"
          type="search"
          placeholder="Search..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="filter-search"
          aria-label="Search incidents"
        />
        <button type="button" className="btn btn-secondary" onClick={onFilterClick}>
          Filter
        </button>
      </div>
    </div>
  );
}

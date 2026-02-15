/**
 * @typedef {Object} Incident
 * @property {string} id
 * @property {string} title
 * @property {string} service
 * @property {string} severity
 * @property {string} status
 * @property {string} [owner]
 * @property {string} [summary]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];

export const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];

export const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database'];

export const SORT_FIELDS = [
  { value: 'title', label: 'Title' },
  { value: 'service', label: 'Service' },
  { value: 'severity', label: 'Severity' },
  { value: 'status', label: 'Status' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'owner', label: 'Owner' },
];

export const DEFAULT_PAGE_SIZE = 10;

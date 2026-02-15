import { get, post, patch } from './client.js';
import { mockApi } from './mock.js';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
const useMock = !API_BASE || import.meta.env.VITE_USE_MOCK === 'true';

/**
 * @param {{ page?: number, limit?: number, service?: string, severity?: string, status?: string, search?: string, sortBy?: string, sortOrder?: 'asc'|'desc' }} params
 * @returns {Promise<{ data: Array<import('../lib/constants').Incident>, total: number }>}
 */
export function getIncidents(params = {}) {
  if (useMock) return mockApi.getIncidents(params);
  const search = new URLSearchParams();
  if (params.page != null) search.set('page', String(params.page));
  if (params.limit != null) search.set('limit', String(params.limit));
  if (params.service) search.set('service', params.service);
  if (params.severity) search.set('severity', params.severity);
  if (params.status) search.set('status', params.status);
  if (params.search) search.set('search', params.search);
  if (params.sortBy) search.set('sortBy', params.sortBy);
  if (params.sortOrder) search.set('sortOrder', params.sortOrder);
  const qs = search.toString();
  return get(`/api/incidents${qs ? `?${qs}` : ''}`);
}

/**
 * @param {string} id
 * @returns {Promise<import('../lib/constants').Incident>}
 */
export function getIncident(id) {
  if (useMock) return mockApi.getIncident(id);
  return get(`/api/incidents/${id}`);
}

/**
 * @param {{ title: string, service: string, severity: string, status: string, owner?: string, summary?: string }} body
 * @returns {Promise<import('../lib/constants').Incident>}
 */
export function createIncident(body) {
  if (useMock) return mockApi.createIncident(body);
  return post('/api/incidents', body);
}

/**
 * @param {string} id
 * @param {Partial<{ severity: string, status: string, owner: string, summary: string }>} body
 * @returns {Promise<import('../lib/constants').Incident>}
 */
export function updateIncident(id, body) {
  if (useMock) return mockApi.updateIncident(id, body);
  return patch(`/api/incidents/${id}`, body);
}

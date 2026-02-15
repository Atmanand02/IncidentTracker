import { useQuery } from '@tanstack/react-query';
import { getIncidents } from '../api/incidents';

/**
 * @param {{ page?: number, limit?: number, service?: string, severity?: string, status?: string, search?: string, sortBy?: string, sortOrder?: 'asc'|'desc' }} params
 */
export function useIncidents(params) {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => getIncidents(params),
  });
}

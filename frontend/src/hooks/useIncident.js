import { useQuery } from '@tanstack/react-query';
import { getIncident } from '../api/incidents';

export function useIncident(id) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => getIncident(id),
    enabled: Boolean(id),
  });
}

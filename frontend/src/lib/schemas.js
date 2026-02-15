import { z } from 'zod';

export const createIncidentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  service: z.string().min(1, 'Please select a service'),
  severity: z.enum(['SEV1', 'SEV2', 'SEV3', 'SEV4']),
  status: z.string().min(1, 'Please select a status'),
  owner: z.string().optional(),
  summary: z.string().optional(),
});

export const editIncidentSchema = z.object({
  severity: z.enum(['SEV1', 'SEV2', 'SEV3', 'SEV4']),
  status: z.enum(['OPEN', 'MITIGATED', 'RESOLVED']),
  owner: z.string().optional(),
  summary: z.string().optional(),
});

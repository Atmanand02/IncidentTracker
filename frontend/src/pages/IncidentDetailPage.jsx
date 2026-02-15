import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useIncident } from '../hooks/useIncident';
import { updateIncident } from '../api/incidents';
import { editIncidentSchema } from '../lib/schemas';
import { formatOccurredAt } from '../lib/utils';
import { SEVERITIES, STATUSES } from '../lib/constants';
import FormGroup from '../components/form/FormGroup';
import FormSelect from '../components/form/FormSelect';
import FormReadonly from '../components/form/FormReadonly';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: incident, isLoading, isError, error } = useIncident(id);

  const mutation = useMutation({
    mutationFn: (body) => updateIncident(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
      navigate('/');
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(editIncidentSchema),
    defaultValues: { severity: 'SEV1', status: 'OPEN', owner: '', summary: '' },
  });

  const appliedIdRef = useRef(null);
  useEffect(() => {
    if (incident && appliedIdRef.current !== incident.id) {
      appliedIdRef.current = incident.id;
      reset({
        severity: incident.severity,
        status: incident.status,
        owner: incident.owner ?? '',
        summary: incident.summary ?? '',
      });
    }
  }, [incident, reset]);

  const onSubmit = (values) => {
    mutation.mutate({
      severity: values.severity,
      status: values.status,
      owner: values.owner || undefined,
      summary: values.summary || undefined,
    });
  };

  if (isLoading || !incident) {
    return (
      <div className="page-detail">
        <div className="detail-loading">Loading incident…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-detail">
        <div className="list-error" role="alert">
          <p>Failed to load incident: {error?.message || 'Unknown error'}.</p>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-detail">
      <h2 className="detail-title">{incident.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="detail-form">
        <FormReadonly label="Service" value={incident.service} />

        <FormSelect
          id="detail-severity"
          label="Severity"
          register={register}
          name="severity"
          options={SEVERITIES}
          error={errors.severity?.message}
        />

        <FormSelect
          id="detail-status"
          label="Status"
          register={register}
          name="status"
          options={STATUSES}
          error={errors.status?.message}
        />

        <FormGroup id="detail-owner" label="Assigned To" error={errors.owner?.message}>
          <input
            id="detail-owner"
            type="text"
            {...register('owner')}
            className="form-input"
            placeholder="Optional"
            aria-invalid={!!errors.owner}
          />
        </FormGroup>

        <FormReadonly label="Occurred At" value={formatOccurredAt(incident.createdAt)} />

        <FormGroup id="detail-summary" label="Summary" error={errors.summary?.message}>
          <textarea
            id="detail-summary"
            rows={4}
            {...register('summary')}
            className="form-input form-textarea"
            placeholder="Describe the incident..."
            aria-invalid={!!errors.summary}
          />
        </FormGroup>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending || !isDirty}>
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

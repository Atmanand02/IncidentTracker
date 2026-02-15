import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIncident } from '../api/incidents';
import { createIncidentSchema } from '../lib/schemas';
import { STATUSES, SERVICES } from '../lib/constants';
import FormGroup from '../components/form/FormGroup';
import FormSelect from '../components/form/FormSelect';
import SeverityRadios from '../components/form/SeverityRadios';

export default function CreateIncidentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      navigate('/');
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: { title: '', service: '', severity: 'SEV1', status: '', owner: '', summary: '' },
  });

  const onSubmit = (values) => {
    mutation.mutate({
      title: values.title.trim(),
      service: values.service,
      severity: values.severity,
      status: values.status,
      owner: values.owner?.trim() || undefined,
      summary: values.summary?.trim() || undefined,
    });
  };

  return (
    <div className="page-create">
      <h2 className="detail-title">Create New Incident</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="create-form">
        <FormGroup id="create-title" label="Title" error={errors.title?.message}>
          <input
            id="create-title"
            type="text"
            {...register('title')}
            className="form-input"
            placeholder="Issue Title..."
            aria-required
            aria-invalid={!!errors.title}
          />
        </FormGroup>

        <FormSelect
          id="create-service"
          label="Service"
          register={register}
          name="service"
          options={SERVICES}
          placeholder="Select Service"
          error={errors.service?.message}
          required
        />

        <SeverityRadios register={register} name="severity" error={errors.severity?.message} />

        <FormSelect
          id="create-status"
          label="Status"
          register={register}
          name="status"
          options={STATUSES}
          placeholder="Select Status"
          error={errors.status?.message}
          required
        />

        <FormGroup id="create-owner" label="Assigned To" error={errors.owner?.message}>
          <input
            id="create-owner"
            type="text"
            {...register('owner')}
            className="form-input"
            placeholder="Optional"
            aria-invalid={!!errors.owner}
          />
        </FormGroup>

        <FormGroup id="create-summary" label="Summary" error={errors.summary?.message}>
          <textarea
            id="create-summary"
            rows={4}
            {...register('summary')}
            className="form-input form-textarea"
            placeholder="Describe the incident..."
            aria-invalid={!!errors.summary}
          />
        </FormGroup>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create Incident'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>

      {mutation.isError && (
        <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>
          Failed to create incident: {mutation.error?.message || 'Unknown error'}.
        </p>
      )}
    </div>
  );
}

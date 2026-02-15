import { SEVERITIES } from '../../lib/constants';

export default function SeverityRadios({ register, name, error }) {
  return (
    <div className="form-group">
      <span className="form-label">Severity</span>
      <fieldset className="form-radios" aria-label="Severity">
        {SEVERITIES.map((sev) => (
          <label key={sev} className="form-radio-label">
            <input type="radio" value={sev} {...register(name)} className="form-radio" />
            {sev}
          </label>
        ))}
      </fieldset>
      {error && (
        <span className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

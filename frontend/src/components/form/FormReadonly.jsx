export default function FormReadonly({ label, value }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <p className="form-readonly">{value ?? '—'}</p>
    </div>
  );
}

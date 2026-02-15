export default function FormSelect({
  id,
  label,
  register,
  name,
  options,
  placeholder = '',
  error,
  required,
  ...rest
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <select
        id={id}
        {...register(name)}
        className="form-input"
        aria-required={required}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <span className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

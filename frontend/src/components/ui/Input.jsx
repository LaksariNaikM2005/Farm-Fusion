import React from 'react';

export function FormField({ label, error, helperText, required = false, className = '', children }) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span className="form-helper">{helperText}</span>}
    </div>
  );
}

export function Input({
  label,
  error,
  helperText,
  required,
  icon,
  className = '',
  id,
  ...props
}) {
  const inputElement = (
    <div className={`input-wrapper ${icon ? 'has-icon' : ''} ${error ? 'input-has-error' : ''}`}>
      {icon && <span className="input-icon">{icon}</span>}
      <input className={`form-input ${className}`} id={id} {...props} />
    </div>
  );

  if (!label && !error && !helperText) return inputElement;

  return (
    <FormField label={label} error={error} helperText={helperText} required={required}>
      {inputElement}
    </FormField>
  );
}

export function Select({
  label,
  error,
  helperText,
  required,
  options = [],
  children,
  className = '',
  ...props
}) {
  const selectElement = (
    <select className={`form-select ${error ? 'input-has-error' : ''} ${className}`} {...props}>
      {children ||
        options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
    </select>
  );

  if (!label && !error && !helperText) return selectElement;

  return (
    <FormField label={label} error={error} helperText={helperText} required={required}>
      {selectElement}
    </FormField>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  required,
  className = '',
  rows = 4,
  ...props
}) {
  const textareaElement = (
    <textarea
      rows={rows}
      className={`form-textarea ${error ? 'input-has-error' : ''} ${className}`}
      {...props}
    />
  );

  if (!label && !error && !helperText) return textareaElement;

  return (
    <FormField label={label} error={error} helperText={helperText} required={required}>
      {textareaElement}
    </FormField>
  );
}

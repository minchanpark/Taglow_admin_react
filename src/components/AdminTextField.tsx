import type { InputHTMLAttributes } from 'react';
import './AdminTextField.css';

type AdminTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
  errorMessage?: string;
};

export function AdminTextField({
  errorMessage,
  helperText,
  id,
  label,
  ...props
}: AdminTextFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <label className="field underline-field" htmlFor={fieldId}>
      <span className="field-label">{label}</span>
      <input id={fieldId} className="field-input" {...props} />
      {errorMessage ? (
        <span className="field-error">{errorMessage}</span>
      ) : helperText ? (
        <span className="field-helper">{helperText}</span>
      ) : null}
    </label>
  );
}

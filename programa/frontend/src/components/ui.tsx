import type { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
    </div>
  );
}

interface InputBaseProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  required,
  disabled,
  placeholder,
}: InputBaseProps & { type?: 'text' | 'date' | 'number' | 'search' }) {
  return (
    <Field label={label} required={required}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        min={type === 'number' ? 1 : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 2,
  placeholder,
}: InputBaseProps & { rows?: number }) {
  return (
    <Field label={label}>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export interface Opcion {
  value: string;
  label: string;
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  required,
  disabled,
}: InputBaseProps & { options: Opcion[] }) {
  return (
    <Field label={label} required={required}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Check({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`chk ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return <div className="alert error">{children}</div>;
}

export function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
  return <p className="cargando">{texto}</p>;
}

export function Btn({
  children,
  onClick,
  primary,
  ghost,
  danger,
  submit,
  type,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  ghost?: boolean;
  danger?: boolean;
  submit?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const cls = ['btn'];
  if (primary) cls.push('primary');
  if (ghost) cls.push('ghost');
  if (danger) cls.push('danger');
  return (
    <button
      type={submit ? 'submit' : type ?? 'button'}
      className={cls.join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

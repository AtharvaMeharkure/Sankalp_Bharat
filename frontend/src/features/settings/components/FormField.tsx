import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({
  label,
  hint,
  error,
  children,
  ...inputProps
}: FormFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {children ?? (
        <input
          {...inputProps}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
        />
      )}
      {hint ? <p className="text-xs text-steel">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </label>
  );
}

import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", label, hint, error, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label ? (
        <span className="font-medium text-slate-200">{label}</span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={`h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 ${error ? "border-rose-500" : ""} ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-400">{error}</span> : null}
      {!error && hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
});

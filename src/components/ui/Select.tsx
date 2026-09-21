import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = "", label, hint, options, id, ...props },
  ref,
) {
  const selectId = id ?? props.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label ? (
        <span className="font-medium text-slate-200">{label}</span>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className={`h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-slate-100 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
});

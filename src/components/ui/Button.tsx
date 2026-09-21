import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 text-slate-950 hover:brightness-110 focus-visible:ring-cyan-400/50 shadow-md shadow-teal-500/25",
  secondary:
    "bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100 hover:from-slate-700 hover:to-slate-600 focus-visible:ring-slate-400/40",
  ghost:
    "bg-transparent text-slate-300 hover:bg-white/8 hover:text-white focus-visible:ring-slate-400/30",
  danger:
    "bg-gradient-to-r from-rose-600 to-orange-500 text-white hover:brightness-110 focus-visible:ring-rose-400/40",
  outline:
    "border border-cyan-400/35 bg-cyan-500/5 text-cyan-100 hover:bg-cyan-500/15 focus-visible:ring-cyan-400/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = "",
      variant = "primary",
      size = "md",
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  },
);

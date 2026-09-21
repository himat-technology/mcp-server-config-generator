import type { HTMLAttributes } from "react";

type Tone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "teal"
  | "coral";

const tones: Record<Tone, string> = {
  neutral: "bg-slate-800/80 text-slate-200 border-slate-600/80",
  success: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  warning: "bg-amber-500/20 text-amber-100 border-amber-400/40",
  danger: "bg-rose-500/20 text-rose-100 border-rose-400/40",
  info: "bg-sky-500/20 text-sky-100 border-sky-400/40",
  teal: "bg-teal-500/20 text-teal-100 border-teal-400/40",
  coral: "bg-orange-500/20 text-orange-100 border-orange-400/40",
};

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    />
  );
}

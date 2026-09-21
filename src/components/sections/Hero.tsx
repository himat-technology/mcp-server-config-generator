import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-cyan-400/10">
      <div
        aria-hidden
        className="animate-float-orb pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-teal-400/25 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-orb-delay pointer-events-none absolute -right-16 top-24 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-pulse-glow pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] [background-size:44px_44px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
            HiMat Technology · Free tool
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge tone="teal">Free local tool</Badge>
            <Badge tone="success">Zero server requests</Badge>
            <Badge tone="info">Colorful &amp; fast</Badge>
          </div>
          <h1 className="animate-shimmer-text mt-5 bg-gradient-to-r from-teal-200 via-sky-200 to-orange-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            MCP Server Config Generator & Validator
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Build, configure, validate, sanitize, and export Model Context
            Protocol (`mcpServers`) definitions for Claude Desktop, Cursor, Zed,
            and AI agents.{" "}
            <strong className="font-semibold text-teal-200">
              100% Browser-Local Processing
            </strong>
            .
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            Your API keys, local file paths, environment variables, and MCP
            configurations never leave your browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#generator"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
            >
              Open generator
            </a>
            <a
              href="https://himat.tech/free-tools/mcp-server-config-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-orange-400/40 bg-orange-500/10 px-5 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
            >
              View live demo
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
            >
              How it works
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Need help? Call{" "}
            <a
              href="tel:+919445234023"
              className="font-semibold text-orange-300 hover:text-orange-200"
            >
              94452 34023
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

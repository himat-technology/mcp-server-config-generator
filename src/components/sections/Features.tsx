const FEATURES = [
  {
    title: "100% Client-Side Privacy",
    body: "Zero network requests for your configuration payload. Commands, env vars, API keys, and file paths stay in browser memory.",
    accent: "from-teal-500/25 to-cyan-500/5 border-teal-400/30",
    chip: "bg-teal-400 text-slate-950",
  },
  {
    title: "Multi-Client Export Support",
    body: "Export formats for Claude Desktop, Cursor, Zed context_servers, and raw mcpServers blocks.",
    accent: "from-sky-500/25 to-blue-500/5 border-sky-400/30",
    chip: "bg-sky-400 text-slate-950",
  },
  {
    title: "Official & Community Presets",
    body: "One-click starters for Filesystem, Brave Search, Memory, GitHub, PostgreSQL, Fetch, Puppeteer, and custom STDIO/SSE.",
    accent: "from-orange-500/25 to-amber-500/5 border-orange-400/30",
    chip: "bg-orange-400 text-slate-950",
  },
  {
    title: "API Key & Secret Sanitization",
    body: "Detects unmasked secrets and offers ${ENV_VAR} placeholder replacement before you copy or commit a file.",
    accent: "from-rose-500/25 to-orange-500/5 border-rose-400/30",
    chip: "bg-rose-400 text-slate-950",
  },
  {
    title: "Real-Time JSON Validation",
    body: "Validates structure, transport requirements, args/env types, duplicate names, and import errors with clear diagnostics.",
    accent: "from-emerald-500/25 to-teal-500/5 border-emerald-400/30",
    chip: "bg-emerald-400 text-slate-950",
  },
  {
    title: "One-Click Copy & Download",
    body: "Copy formatted JSON to the clipboard or download a client-named .json file entirely in the browser.",
    accent: "from-fuchsia-500/20 to-sky-500/5 border-fuchsia-400/25",
    chip: "bg-fuchsia-400 text-slate-950",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-24 border-t border-cyan-400/10 py-16 sm:py-20"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            Why teams love it
          </p>
          <h2
            id="features-heading"
            className="mt-2 bg-gradient-to-r from-white via-cyan-100 to-orange-100 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl"
          >
            Built for developers who ship agent tooling
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Your credentials, local paths, and secret tokens stay strictly
            local—unlike remote builders that can log environment variables or
            connection strings.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className={`rounded-2xl border bg-gradient-to-br p-5 shadow-lg shadow-slate-950/30 transition hover:-translate-y-0.5 hover:shadow-xl ${feature.accent}`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${feature.chip}`}
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

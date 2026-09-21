const STEPS = [
  {
    title: "Select a client",
    body: "Choose Claude Desktop, Cursor, Zed, or a raw mcpServers object. The export filename and JSON shape update instantly.",
  },
  {
    title: "Select a preset",
    body: "Start from Filesystem, Brave Search, Memory, GitHub, PostgreSQL, Fetch, Puppeteer, or blank STDIO/SSE templates.",
  },
  {
    title: "Configure your server",
    body: "Edit the server name, transport, command runner, arguments, environment variables, and optional SSE URL.",
  },
  {
    title: "Validate",
    body: "The live validator checks JSON structure, required fields, duplicate names, and transport-specific rules.",
  },
  {
    title: "Sanitize secrets",
    body: "The local scanner flags hardcoded tokens and can replace them with ${ENV_VAR} placeholders.",
  },
  {
    title: "Copy or download",
    body: "Copy the formatted JSON or download a ready-to-use file for your selected client.",
  },
  {
    title: "Add it to your AI client",
    body: "Save the file to the client-specific location and restart or reload the client so servers appear.",
  },
];

const STEP_COLORS = [
  "from-teal-500/20 to-cyan-500/5 border-teal-400/30 text-teal-200",
  "from-sky-500/20 to-blue-500/5 border-sky-400/30 text-sky-200",
  "from-orange-500/20 to-amber-500/5 border-orange-400/30 text-orange-200",
  "from-emerald-500/20 to-teal-500/5 border-emerald-400/30 text-emerald-200",
  "from-rose-500/20 to-orange-500/5 border-rose-400/30 text-rose-200",
  "from-cyan-500/20 to-sky-500/5 border-cyan-400/30 text-cyan-200",
  "from-amber-500/20 to-orange-500/5 border-amber-400/30 text-amber-200",
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-cyan-400/10 py-16 sm:py-20"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Step by step
          </p>
          <h2
            id="how-heading"
            className="mt-2 bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl"
          >
            How to Build & Deploy MCP Server Configurations
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            A privacy-first workflow for generating production-ready MCP
            configuration files entirely on your machine.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`rounded-2xl border bg-gradient-to-br p-5 ${STEP_COLORS[index % STEP_COLORS.length]}`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                {index + 1}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-teal-400/25 bg-gradient-to-br from-teal-500/15 to-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">What is MCP?</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Model Context Protocol (MCP) is an open standard that lets AI
              clients securely connect to external tools, local filesystems,
              databases, and APIs through a consistent server interface. Instead
              of hardcoding integrations into every agent, you declare servers
              once and the client launches or connects to them at runtime.
            </p>
          </article>
          <article className="rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/15 to-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">
              Where to save configuration
            </h3>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
              <li>
                <strong className="text-orange-200">Claude Desktop:</strong>{" "}
                macOS `~/Library/Application Support/Claude/claude_desktop_config.json`
                · Windows `%APPDATA%\Claude\claude_desktop_config.json`
              </li>
              <li>
                <strong className="text-orange-200">Cursor:</strong> project
                `.cursor/mcp.json` or global `~/.cursor/mcp.json`
              </li>
              <li>
                <strong className="text-orange-200">Zed:</strong> `settings.json`
                under `context_servers` (open via{" "}
                <code className="text-teal-300">zed: open settings file</code>)
              </li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Exact paths can vary by OS and client version—confirm in your
              client docs if something does not load.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

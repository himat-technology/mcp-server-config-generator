const FAQS = [
  {
    q: "What is MCP?",
    a: "Model Context Protocol is an open standard for connecting AI clients to external tools and data sources through declarative server configurations.",
  },
  {
    q: "Is my API key uploaded?",
    a: "No. This application has no backend endpoint that receives API keys, environment variables, MCP configuration, file paths, or connection strings. Everything stays in your browser.",
  },
  {
    q: "Does this tool require an account?",
    a: "No account, registration, or authentication is required.",
  },
  {
    q: "Which clients are supported?",
    a: "Claude Desktop (claude_desktop_config.json), Cursor (.cursor/mcp.json), Zed (context_servers in settings.json), and a raw mcpServers export.",
  },
  {
    q: "Can I create custom MCP servers?",
    a: "Yes. Use Custom STDIO, Custom SSE, or New Server to define command runners, arguments, env vars, and remote URLs.",
  },
  {
    q: "Can I import an existing config?",
    a: "Yes. Use Import JSON to paste an existing mcpServers or Zed context_servers object. Invalid JSON is reported without crashing the app.",
  },
  {
    q: "Can I export JSON?",
    a: "Yes. Copy Config places JSON on the clipboard. Download JSON creates a local .json file named for your selected client.",
  },
  {
    q: "How are secrets detected?",
    a: "A client-side scanner checks env values, headers, and sensitive patterns such as sk-, ghp_, github_pat_, Bearer tokens, password-like keys, and credentialed connection strings.",
  },
  {
    q: "Does the tool require a backend?",
    a: "No. The generator is a static Next.js front end. Configuration processing never leaves the browser.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-cyan-400/10 py-16 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          className="bg-gradient-to-r from-white via-sky-100 to-orange-100 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-cyan-400/10 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-slate-900/80 to-slate-950/90">
          {FAQS.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white outline-none marker:content-none focus-visible:text-cyan-300">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="rounded-full bg-gradient-to-r from-teal-500 to-orange-400 px-2 text-slate-950 transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

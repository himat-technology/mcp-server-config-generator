export function CTA() {
  return (
    <section className="border-t border-cyan-400/10 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-500/20 via-slate-900 to-orange-500/20 px-6 py-10 sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              HiMat Technology
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to generate a privacy-first MCP configuration?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Jump back to the builder, or try the live demo on himat.tech.
              Questions? Call{" "}
              <a
                href="tel:+919445234023"
                className="font-semibold text-orange-300 hover:text-orange-200"
              >
                94452 34023
              </a>
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#generator"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
              >
                Back to generator
              </a>
              <a
                href="https://himat.tech/free-tools/mcp-server-config-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-orange-400/40 bg-orange-500/10 px-5 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/20"
              >
                Open live demo
              </a>
              <a
                href="https://www.linkedin.com/company/himat-technology"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 px-5 text-sm font-medium text-sky-100 transition hover:bg-sky-500/20"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

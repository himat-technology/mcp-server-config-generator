import Link from "next/link";

const LINKS = [
  { href: "#generator", label: "Generator" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

const SOCIAL = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Himat-technology/61593829197445/",
    color: "hover:text-sky-300 hover:border-sky-400/50",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/himat-technology",
    color: "hover:text-blue-300 hover:border-blue-400/50",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/himat_technology",
    color: "hover:text-rose-300 hover:border-rose-400/50",
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-cyan-400/15 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-cyan-400 to-orange-400 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/30">
            HT
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">
              HiMat Technology
            </span>
            <span className="hidden truncate text-[11px] text-cyan-200/80 sm:block">
              MCP Config Generator
            </span>
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://himat.tech/free-tools/mcp-server-config-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center rounded-lg border border-orange-400/40 bg-orange-500/10 px-3 text-xs font-medium text-orange-200 transition hover:bg-orange-500/20 sm:inline-flex"
          >
            Live demo
          </a>
          <a
            href="#generator"
            className="inline-flex h-9 items-center rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 px-3 text-xs font-semibold text-slate-950 shadow-md shadow-teal-500/30 transition hover:from-teal-400 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
          >
            Launch
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-cyan-400/15 bg-slate-950/60 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">HiMat Technology</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            MCP Server Config Generator — local-first, colorful, and private.
            Your keys and paths never leave the browser.
          </p>
          <p className="mt-4 text-sm text-slate-300">
            Contact:{" "}
            <a
              href="tel:+919445234023"
              className="font-semibold text-orange-300 transition hover:text-orange-200"
            >
              94452 34023
            </a>
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            Connect
          </p>
          <div className="flex flex-wrap gap-2">
            {SOCIAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition ${item.color}`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://himat.tech/free-tools/mcp-server-config-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-200 transition hover:border-teal-300/50 hover:text-teal-100"
            >
              Live demo
            </a>
          </div>
          <p className="text-xs text-slate-500">MIT License · Built for developers</p>
        </div>
      </div>
    </footer>
  );
}

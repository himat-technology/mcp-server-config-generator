# MCP Server Config Generator

<p align="center">
  <strong>Build · Validate · Sanitize · Export</strong><br/>
  Privacy-first Model Context Protocol configs for Claude Desktop, Cursor &amp; Zed
</p>

<p align="center">
  <a href="https://himat.tech/free-tools/mcp-server-config-generator"><img src="https://img.shields.io/badge/Live%20Demo-himat.tech-00C2A8?style=for-the-badge" alt="Live Demo" /></a>
  <a href="https://www.linkedin.com/company/himat-technology"><img src="https://img.shields.io/badge/LinkedIn-HiMat%20Technology-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://www.facebook.com/people/Himat-technology/61593829197445/"><img src="https://img.shields.io/badge/Facebook-HiMat%20Technology-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" /></a>
  <a href="https://www.instagram.com/himat_technology"><img src="https://img.shields.io/badge/Instagram-@himat__technology-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
  <a href="tel:+919445234023"><img src="https://img.shields.io/badge/Call-94452%2034023-FF6B35?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Contact" /></a>
</p>

---

## Live demo

Try the production tool online:

**[https://himat.tech/free-tools/mcp-server-config-generator](https://himat.tech/free-tools/mcp-server-config-generator)**

This repository is a fully working local recreation of that experience — run it offline with `npm install` + `npm run dev`.

---

## About HiMat Technology

Built with ❤️ for developers shipping AI agents and MCP tooling.

| | |
| --- | --- |
| **Company** | [HiMat Technology](https://himat.tech/free-tools/mcp-server-config-generator) |
| **Phone** | [94452 34023](tel:+919445234023) · `+91 94452 34023` |
| **Facebook** | [Himat Technology](https://www.facebook.com/people/Himat-technology/61593829197445/) |
| **LinkedIn** | [himat-technology](https://www.linkedin.com/company/himat-technology) |
| **Instagram** | [@himat_technology](https://www.instagram.com/himat_technology) |

---

## Features

- Interactive MCP configuration workspace (editor + live JSON preview)
- Client target formats: Claude Desktop, Cursor, Zed (`context_servers`), Raw `mcpServers`
- STDIO and SSE transports
- One-click presets: Filesystem, Brave Search, Memory, GitHub, PostgreSQL, Fetch, Puppeteer, Custom STDIO/SSE
- Dynamic arguments and environment variables
- Import existing JSON with graceful error handling
- Real-time schema/structure validation
- Client-side secret detection and sanitization
- Copy to clipboard + local JSON download
- Config size / line / active server statistics
- Documentation, FAQ, SEO metadata, and accessible UI
- Unit tests for core business logic

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Zod (validation)
- Vitest (unit tests)

No database, backend, authentication, or external configuration APIs are required.

## Privacy architecture

**100% browser-local processing.**

There is no API route that accepts:

- API keys
- environment variables
- database passwords
- MCP configuration payloads
- local file paths
- command arguments
- connection strings

All parsing, validation, secret scanning, sanitization, copy, and download happen in the browser using React state. Configuration is kept in memory (not written to `localStorage`).

## Architecture

```text
src/
  app/                      # Next.js App Router pages + SEO layout
  components/
    mcp/                    # Interactive generator UI
    sections/               # Marketing/docs sections (SSR-friendly)
    ui/                     # Reusable primitives
  hooks/useMcpWorkspace.ts  # Client workspace state
  lib/mcp/                  # Business logic (pure, testable)
    types.ts
    presets.ts
    validators.ts
    generators.ts
    exporters.ts
    sanitizer.ts
    secretScanner.ts
  types/mcp.ts              # Shared TypeScript contracts
  __tests__/mcp.test.ts     # Core logic tests
```

Business logic lives under `src/lib/mcp`. UI components call those helpers instead of embedding export/validation rules.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Compare with the live demo: [himat.tech MCP generator](https://himat.tech/free-tools/mcp-server-config-generator).

## Production build

```bash
npm run build
npm start
```

## Testing

```bash
npm test
npm run typecheck
npm run lint
```

Covered areas include JSON parsing, MCP validation, presets, args/env management, enable/disable, secret detection, sanitization, generation, and client export formats.

## MCP configuration examples

### STDIO (Filesystem)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/Users/username/Projects"
      ]
    }
  }
}
```

### STDIO with env (Brave Search)

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_BRAVE_API_KEY_HERE"
      }
    }
  }
}
```

### SSE

```json
{
  "mcpServers": {
    "custom-sse": {
      "url": "https://example.com/sse"
    }
  }
}
```

### Zed export shape

```json
{
  "context_servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    }
  }
}
```

## Where to save configs

Paths can vary by OS and client version:

- **Claude Desktop (macOS):** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Claude Desktop (Windows):** `%APPDATA%\Claude\claude_desktop_config.json`
- **Cursor:** `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global)
- **Zed:** `settings.json` → `context_servers`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Serve production build |
| `npm test` | Run unit tests |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Contributing

1. Fork and clone the repository
2. Run `npm install`
3. Create a feature branch
4. Add/adjust tests under `src/__tests__` for logic changes
5. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`
6. Open a pull request with a clear summary

Please keep configuration processing client-side. Do not add endpoints that receive user secrets or MCP configs.

## Contact & community

Questions about HiMat Technology or this free tool?

- **Live demo:** [himat.tech/free-tools/mcp-server-config-generator](https://himat.tech/free-tools/mcp-server-config-generator)
- **Call / WhatsApp:** [94452 34023](tel:+919445234023)
- **Facebook:** [Himat Technology](https://www.facebook.com/people/Himat-technology/61593829197445/)
- **LinkedIn:** [HiMat Technology](https://www.linkedin.com/company/himat-technology)
- **Instagram:** [@himat_technology](https://www.instagram.com/himat_technology)

## License

MIT

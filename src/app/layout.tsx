import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MCP Server Config Generator & Validator | HiMat Technology",
  description:
    "Build, validate, sanitize, and export MCP server configurations for Claude Desktop, Cursor, Zed, and AI agents. 100% browser-local and privacy-first.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MCP Server Config Generator & Validator | HiMat Technology",
    description:
      "Build, validate, sanitize, and export MCP server configurations for Claude Desktop, Cursor, Zed, and AI agents. 100% browser-local and privacy-first.",
    url: "/",
    siteName: "MCP Server Config Generator",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Server Config Generator & Validator",
    description:
      "Build, validate, sanitize, and export MCP configs entirely in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "MCP",
    "Model Context Protocol",
    "Claude Desktop",
    "Cursor",
    "Zed",
    "mcpServers",
    "config generator",
    "privacy-first",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MCP Server Config Generator & Validator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Build, validate, sanitize, and export MCP server configurations for Claude Desktop, Cursor, Zed, and AI agents. 100% browser-local and privacy-first.",
  featureList: [
    "Client-side MCP configuration generation",
    "Secret scanning and sanitization",
    "Claude Desktop, Cursor, and Zed export formats",
    "JSON import and validation",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

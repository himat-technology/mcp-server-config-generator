import { ConfigBuilder } from "@/components/mcp/ConfigBuilder";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import {
  SiteFooter,
  SiteHeader,
} from "@/components/sections/SiteChrome";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <ConfigBuilder />
        </div>
        <HowItWorks />
        <Features />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}

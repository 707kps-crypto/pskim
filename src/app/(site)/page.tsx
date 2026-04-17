import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ServiceSection from "@/components/sections/ServiceSection";
import BoardSection from "@/components/sections/BoardSection";
import ConsultCTA from "@/components/ConsultCTA";
import ScrollReveal from "@/components/ScrollReveal";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { webSiteSchema, breadcrumbSchema } from "@/lib/seo/schemas";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          webSiteSchema(),
          breadcrumbSchema([{ name: "홈", url: "https://pskim.biz" }]),
        ]}
      />
      <HeroSection />
      <ScrollReveal>
        <ProcessSection />
      </ScrollReveal>
      <ScrollReveal>
        <ServiceSection />
      </ScrollReveal>
      <ScrollReveal>
        <BoardSection />
      </ScrollReveal>
      <ConsultCTA />
    </>
  );
}

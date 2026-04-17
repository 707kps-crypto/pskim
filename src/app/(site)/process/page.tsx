import type { Metadata } from "next";
import ProcessClient from "./ProcessClient";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { faqSchema, howToSchema, breadcrumbSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = pageMetadata.process;
export const revalidate = 3600;

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(),
          howToSchema(),
          breadcrumbSchema([
            { name: "홈", url: "https://pskim.biz" },
            { name: "진행과정", url: "https://pskim.biz/process" },
          ]),
        ]}
      />
      <ProcessClient />
    </>
  );
}

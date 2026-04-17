import type { Metadata } from "next";
import MktClient from "./MktClient";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = pageMetadata.mkt;
export const revalidate = 3600;

export default function MktPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema("mkt"),
          breadcrumbSchema([
            { name: "홈", url: "https://pskim.biz" },
            { name: "온라인마케팅", url: "https://pskim.biz/mkt" },
          ]),
        ]}
      />
      <MktClient />
    </>
  );
}

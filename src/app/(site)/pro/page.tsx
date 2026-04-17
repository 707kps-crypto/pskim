import type { Metadata } from "next";
import ProClient from "./ProClient";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = pageMetadata.pro;
export const revalidate = 3600;

export default function ProPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema("pro"),
          breadcrumbSchema([
            { name: "홈", url: "https://pskim.biz" },
            { name: "전문서비스", url: "https://pskim.biz/pro" },
          ]),
        ]}
      />
      <ProClient />
    </>
  );
}

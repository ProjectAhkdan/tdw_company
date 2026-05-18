import type { Metadata } from "next";
import { siteConfig } from "@/shared/config/site.config";

export function generateMetadata(override?: Partial<Metadata>): Metadata {
  return {
    title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
    description: siteConfig.description,
    ...override,
  };
}

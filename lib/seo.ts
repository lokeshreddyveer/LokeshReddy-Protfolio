import type { Metadata } from "next";

const origin = "https://lokeshreddy.dev";

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = `${origin}${path}`;
  return {
    title,
    description,
    metadataBase: new URL(origin),
    alternates: { canonical: path },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

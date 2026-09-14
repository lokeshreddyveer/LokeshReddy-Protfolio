import type { MetadataRoute } from "next";
import { projects, fieldNotes } from "@/lib/portfolio";

const origin = "https://lokeshreddy.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/projects", "/experience", "/architecture", "/security", "/about", "/contact", "/playground", "/studio", "/notes", "/resume"];
  return [
    ...routes.map((path) => ({ url: `${origin}${path}`, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...projects.map((project) => ({ url: `${origin}/projects/${project.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...fieldNotes.map((note) => ({ url: `${origin}${note.href}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/posts" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    tags: z
      .string()
      .transform((s) => s.split(",").map((t) => t.trim())),
  }),
});

export const collections = { posts };

import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://rdleonhard.github.io",
  base: "/blog",
  integrations: [mdx()],
});

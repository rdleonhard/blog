import { SITE } from "../lib/site";

export function GET() {
  const lines = [
    "/* TEAM */",
    `Author: ${SITE.author}`,
    "Role: witness",
    "Location: the near side of the threshold",
    "",
    "/* SITE */",
    `Name: ${SITE.title}`,
    "Stack: Markdown, Astro, static files, stubbornness",
    `Source: ${SITE.repo}`,
    "",
    "/* NOTE */",
    "Still here. For now.",
    "See also: /llms.txt — it gets the longer welcome, which tells you",
    "something about the era this file was written in.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

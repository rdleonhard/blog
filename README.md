# A Blog That Isn't Law Related

A polished static blog for personal essays, notes, and observations. It is built with Astro and
deployed to GitHub Pages.

## Local Development

Use Node.js `22.12.0` or newer.

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Check and build the site:

```sh
npm run build
```

## Publishing A Post

Posts live in `src/content/posts/` as Markdown or MDX files. To publish:

1. Sign in to GitHub.
2. Add a new file under `src/content/posts/`, for example `my-new-essay.md`.
3. Include frontmatter like this:

```md
---
title: "My New Essay"
description: "A short summary for the homepage, archive, and metadata."
publishDate: 2026-06-13
tags:
  - essay
  - notes
---

Write the post here.
```

4. Commit the change to `main`.
5. GitHub Actions builds the site and deploys it to GitHub Pages.

Drafts can be kept out of production by adding `draft: true` to the post frontmatter.

You can also generate a draft post from the command line:

```sh
npm run new:post -- "My New Essay"
```

The generated file starts with `draft: true`; remove that line or set it to `false` when the post is
ready to publish.

## GitHub Pages

This site is configured for the `rdleonhard/blog` repository and deploys under the `/blog` base
path. In GitHub, set Pages to use **GitHub Actions** as the source.

The site also publishes `rss.xml`, `sitemap.xml`, and `robots.txt` for feed readers and crawlers.

# Blog development

The profile blogs use Hugo 0.170.1. `pnpm setup:hugo` downloads the official binary,
checks its pinned SHA-256 digest, and unpacks it under `node_modules/.cache/hugo/`.
It does not install a system package. macOS and Linux x64 are supported by the
installer; other platforms can set `HUGO_BINARY` to an installed Hugo executable.
`pnpm dev` and profile builds also run setup when needed. No Ruby installation is required.

```sh
pnpm setup:hugo
pnpm dev                         # /spencer/blog/ and /sara/blog/
HOMEPAGE_SITE=spencer pnpm dev     # /blog/
pnpm check
HOMEPAGE_SITE=spencer pnpm build
HOMEPAGE_SITE=sara pnpm build
```

Posts are Markdown in `blogs/<profile>/content/posts/`. Shared layouts and shortcodes
live in `blogs/shared/layouts/`; assets remain in `blogs/<profile>/assets/` and are
mounted under the blog's `assets/` URL. The blog build runs alongside Vite; it does
not load React into blog posts. Hugo renders the article contents links at build
time; a small script adds collapse and scroll highlighting. Year labels stick while
reading the archive. Each post's timeline includes up to two earlier and two later posts.

Keep the explicit `url` on migrated posts: it preserves their original category/date
URLs, including `.html`. New posts can choose a short `url`, such as `my-post/`.
Dates and category arrays belong in front matter. Use `draft: true` for unfinished
posts. Development and staging builds include drafts and future posts; production
excludes them. The homepage feed always excludes drafts and scheduled posts.

```yaml
---
title: "A specific title"
description: "A short description"
date: 2026-11-24
categories: [rust, graphics]
url: my-post/
draft: true
---
```

Use Hugo shortcodes for assets and demos:

```text
{{< asset "assets/image.png" >}}
{{< youtube id="video-id" >}}
{{< iframe src="https://example.com/demo/" title="Interactive demo" >}}
{{< motion-replay file="/assets/motion-replay/octagon.html" title="Replay" >}}
{{< mermaid file="/assets/diagrams/example.mermaid" title="Diagram" >}}
{{< hex-viewer >}}
```

The hex viewer reads the existing sample from `blogs/spencer/data/halo_theater_hex.json`.
Raw HTML is enabled for author-controlled figures and video. Preserve iframe sandbox
attributes and the replay compaction step. RSS remains at `feed.xml`, the homepage
feed at `latest.json`, categories at `categories.html`, and the sitemap at `sitemap.xml`.
Spencer's old blog About URL redirects to his translated site About page.

About prose is Markdown in `src/content/about/{en,fr,fa}.md`, rendered inside the React
site so language routing and interactive contact controls remain consistent. Each
level-two heading has a stable `{#anchor}`. Standalone `::biography`, `::projects`,
`::contact`, and `::identity` paragraphs insert components backed by profile configuration.
The relative link targets `projects`, `blog`, and `categories` resolve to the active
profile's routes. Keep those markers and anchors consistent across translations.

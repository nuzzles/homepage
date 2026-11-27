# Blog development

Spencer's blog uses Hugo 0.170.1. Sara has no blog. `pnpm setup:hugo` downloads the official binary,
checks its pinned SHA-256 digest, and unpacks it under `node_modules/.cache/hugo/`.
It does not install a system package. macOS and Linux x64 are supported by the
installer; other platforms can set `HUGO_BINARY` to an installed Hugo executable.
`pnpm dev` and profile builds also run setup when needed. No Ruby installation is required.

```sh
pnpm setup:hugo
pnpm dev                         # /spencer/blog/
HOMEPAGE_SITE=spencer pnpm dev     # /blog/
pnpm check
HOMEPAGE_SITE=spencer pnpm build
HOMEPAGE_SITE=sara pnpm build
```

Posts are Markdown in `blog/content/posts/`. Layouts and shortcodes
live in `blog/layouts/`; assets remain in `blog/assets/` and are
mounted under the blog's `assets/` URL. Only `HOMEPAGE_SITE=spencer` builds Hugo; Sara and the selector build React alone. It renders `ProfileHeader` and `ProfileFooter`
into Hugo HTML at build time and hydrates them with the same React components,
shadcn controls, and stylesheet as the homepage. Change those components to update
both surfaces; do not add separate Hugo header/footer markup. Vite shares cached
JavaScript and CSS chunks between the two entries. Restart `pnpm dev` after changing
shared chrome to refresh its server-rendered HTML. The blog language control shows
an English-only indicator; posts stay English-only. Hugo renders the article contents links at build
time; a small script adds collapse and scroll highlighting. Year labels stick while
reading the archive. Each post's timeline includes up to two earlier and two later posts.

Keep the explicit `url` on migrated posts: it preserves their original category/date
URLs, including `.html`. New posts can choose a short `url`, such as `my-post/`.
Dates and category arrays belong in front matter. Use `draft: true` for unfinished
posts. Development and staging builds include drafts and future posts; production
excludes them. The homepage feed includes drafts during local development (`pnpm dev`),
with a Draft badge in Latest. Latest shows up to five posts, with Draft and Opinion badges
below their titles. Built feeds, including staging, exclude drafts; scheduled
posts are excluded from the homepage feed in every environment. RSS and stats remain
limited to published posts.

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

## Blog sharing images

Hugo generates a 1200×630 PNG for each post from its title, categories (or Opinion tag), and
publication month. The template uses Source Serif 4 titles, DM Sans metadata, Spencer's portrait,
and the shared black IM logo. A warm gradient rises from the bottom behind the author name.
It wraps titles using the font's character widths and reduces the
type size when needed. Images have content-based URLs and are shared by Open Graph, X, and article
structured data. Archive pages retain the shared Imbleau banner.

An `image` front-matter block replaces the title and portrait with a photo or screenshot, including
the Halo Theater image. Store the source in `blog/assets/` and use `/assets/filename.png` as its `path`.
Hugo crops it to 1200×630 and adds the same gradient, logo, and author name; the source stays unchanged.
To shorten only the text drawn in an image, add `opengraph: { title: "Shorter image title" }`.
This does not change the article heading or metadata title. No manual export is needed; run
`HOMEPAGE_SITE=spencer pnpm dev` or the normal profile build to preview the resulting `og:image` URL.

The reusable layout lives in `blog/layouts/partials/opengraph/`. Its artwork and font resources live
in `blog/assets/opengraph/`: `base.svg` is the editable source for `base.png`, and `footer.svg` is the
source for the transparent `footer.png` shared by all post images. The palette was exported from
`src/design-tokens.css`; the embedded portrait
and monogram come from `public/images/me-384.webp` and `public/logo.svg`. Update the SVG and PNG together
when changing the static artwork. The TrueType fonts are medium-weight instances of the installed
`@fontsource-variable` families; `serif-widths.json` stores their title-font advances in ems. Keep that
file in sync when changing the title font. Their licenses are in `public/fonts/source-serif-4-OFL.txt`
and `public/fonts/dm-sans-OFL.txt`. Generation uses Hugo's built-in image filters without new dependencies.

## Content shortcodes

Use Hugo shortcodes for assets and demos:

```text
{{< asset "assets/image.png" >}}
{{< youtube id="video-id" >}}
{{< iframe src="https://example.com/demo/" title="Interactive demo" >}}
{{< motion-replay file="/assets/motion-replay/octagon.html" title="Replay" >}}
{{< mermaid file="/assets/diagrams/example.mermaid" title="Diagram" >}}
{{< hex-viewer >}}
```

The hex viewer reads the existing sample from `blog/data/halo_theater_hex.json`.
Raw HTML is enabled for author-controlled figures and video. Preserve iframe sandbox
attributes and the replay compaction step. RSS remains at `feed.xml`, the homepage
feed at `latest.json`, tags at `tags.html`, and the sitemap at `sitemap.xml`.
The former `categories.html` route redirects to the tag archive.
Spencer's old blog About URL redirects to his translated site About page.

About prose is Markdown in `src/content/about/{en,fr,fa}.md`, rendered inside the React
site so language routing and interactive contact controls remain consistent. Each
level-two heading has a stable `{#anchor}`. Standalone `::biography`, `::projects`,
`::contact`, and `::identity` paragraphs insert components backed by profile configuration.
The relative link targets `projects` and `blog` resolve to the active
profile's routes. Keep those markers and anchors consistent across translations.

How I work uses translated Markdown in `src/content/how-i-work/{en,fr,fa}.md` and the
same `MarkdownReadingLayout` as About. Preserve section anchors across translations.
React uses `ContentHeading`; Hugo uses `layouts/_markup/render-heading.html` for
heading permalinks. Both consume the shared marker underline in `src/typography.css`.

The development server keeps its generated pages, static assets, runtime config, and
cache in `node_modules/.cache/hugo-dev/`, separate from production build output and
OS temporary-file cleanup. Restart `pnpm dev` to regenerate a missing embed asset.

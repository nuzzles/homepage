# Homepage

[![Uptime Status](https://img.shields.io/uptimerobot/status/m802358152-3a32dc04dddbd9789a469d21)](https://stats.uptimerobot.com/pTFWZdoTxa)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nuzzles/homepage/ci.yml?logo=github&label=CI)](https://github.com/nuzzles/homepage/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0%2FMIT-blue.svg)](LICENSE-APACHE)

This is the source code for the joint homepage of Spencer Imbleau and Sara Aslani, built with React,
TypeScript, and Vite. Profile blogs are built with Jekyll and served from each profile's `/blog` path.

## Development Setup

**Required Tools:**

- [Node.js](https://nodejs.org/) v24.20.0 (latest LTS)
- [pnpm](https://pnpm.io/) v11.25.0+
- [Ruby](https://www.ruby-lang.org/) v4.0.6 and Bundler
- [resvg](https://github.com/niclas-AKA-Ansen/resvg) (`cargo install resvg`)

**Installation:**

```sh
pnpm install
BUNDLE_PATH=blogs/vendor/bundle bundle install --gemfile blogs/Gemfile
```

**Local Development:**

```sh
pnpm dev
```

This starts the joint homepage at `/` and includes Jekyll blog drafts, using the saved or browser-preferred language
without changing the URL. The explicit English, French, and Farsi selector routes are
`/en`, `/fr`, and `/fa`. Profile routes use the same prefixes, such as `/en/spencer`,
`/fr/spencer`, and `/fa/sara`. It also starts each configured Jekyll blog at its local profile path,
such as `/spencer/blog/` and `/sara/blog/`.

To run the production-shaped Spencer site and its blog locally:

```sh
HOMEPAGE_SITE=spencer pnpm dev
```

Profiles without a configured blog run only the Vite development server.

Profile identity, hostnames, images, contact links, résumé and blog settings, SEO, and translation
keys are defined once in `profiles.json`. The UI, local routes, site builds, deployment
matrix, sitemaps, and Terraform all derive from that registry.

## Available Commands

```sh
pnpm dev      # Start Vite and the configured Jekyll blog
pnpm build    # Build the selected profile and its configured blog
pnpm lint     # Run ESLint
pnpm format   # Format project files
pnpm check    # Run formatting, lint, type, and build checks
pnpm preview  # Preview production build locally
```

Production builds default to the selector. To build and preview a profile site:

```sh
HOMEPAGE_SITE=spencer pnpm build
pnpm preview
```

Valid site values come from `profiles.json`, plus `selector` for the joint homepage.
Deployed `dev` and `stg` builds also include blog drafts; `prod` excludes them.

## Shared blog media

Both profile blogs load `public/blog-media.css` and `public/blog-media.js` through the shared
`blogs/shared/_includes/blog-assets.html` include. Standard post images gain a keyboard-accessible
lightbox automatically. Links to image files open their full-size image; images linking to other
pages keep their normal navigation. Modified clicks retain the browser's usual link behavior.

Figure spacing and captions, image viewing, and Mermaid controls are shared across posts. A post
does not need `halo-theater.css` to use them. The existing Homelab post uses these shared figure
styles and has no post-specific CSS.

Use `stylesheets` in a post's front matter for styles that belong only to that post:

```yaml
stylesheets:
    - /assets/css/my-post.css
```

The profile build versions shared and post-specific stylesheets by content; development uses the
source files. New profile blogs should link `blog-assets.html` and `mermaid.html` from
`blogs/shared/_includes/` into their `_includes/`, and include `blog-assets.html` from their head.

## Mermaid diagrams in profile blogs

Store diagram files under the profile's `assets/diagrams/` directory, then pass the blog-relative path to the include:

```liquid
{% include mermaid.html
   file="/assets/diagrams/halo-theater-structure.mermaid"
   title="From film to frame"
   description="The film's chunks, packets, and bit-packed records." %}
```

`file` is required; `title` and `description` are optional. The include applies the current blog base path,
so use `/assets/…` without adding `/blog`. A post can include multiple diagrams. Put `accTitle` and
`accDescr` in each Mermaid file to describe the diagram for screen readers. Each embed starts fitted
to its canvas and has zoom in/out, Fit, and 100% controls. Drag to pan; Ctrl/⌘ + scroll zooms at the
pointer while ordinary scrolling moves the page. With the canvas focused, use +/− to zoom, arrow
keys to pan, F to fit, and 0 to reset to natural size. Touch dragging also pans the diagram.
Each viewer keeps its own zoom and position. Captions use the same small type as the hex viewer.

Mermaid is installed at a pinned version and served locally, only on pages with an embed. The profile
build creates a separate renderer bundle; `pnpm dev` serves the TypeScript entry through Vite.
Use the profile build above when previewing static output; Jekyll alone does not build the renderer.
If JavaScript is disabled, the caption and diagram-source link remain available. Loading or syntax
errors display a message in the affected figure without preventing other diagrams from rendering.

## Halo Theater motion replay

The Octagon export, replay expansion script, and `halo-theater.css` belong to the Halo Theater
post. Its `motion-replay.html` include loads the replay script only when the post embeds a replay;
other posts and profiles do not load or initialize it.

Build a single-film export in the adjacent `halo_api` repository, then embed the generated HTML:

```sh
node ../halo_api/experiments/examples/build_decoded_replay.cjs --embed \
  --octagon-walls --fixed-loadout 'Bandit EVO,S7 Sniper' --blog-fonts public/fonts \
  ../halo_api/experiments/films/octagon/03-first-to-50/decoded-film.json \
  --output blogs/spencer/assets/motion-replay/octagon.html
```

```liquid
{% include motion-replay.html
   file="/assets/motion-replay/octagon.html"
   download="/assets/motion-replay/octagon.json.gz"
   start=146.2
   title="Octagon motion replay · preview"
   description="A decoded first-to-50 match with placeholder Octagon walls." %}
```

The include takes `file`, plus optional `title`, `description`, `download`, `start`, and `end`, and applies the blog base path.
The exporter also writes a matching `.json.gz` download containing the decoded source data.
Initial start/end values are seconds and configured in code, without visible range settings.
Readers have play/pause, scrubbing, and a camera selector, defaulting to Nuzzles's shoulder view.
There are no speed or loop controls. The score counts recorded kills at the current playhead.
Each lazy iframe contains exactly one recording, with only the viewport and playback timeline visible.
Trails show up to 10 seconds before and after the playhead. The viewport uses placeholder Octagon
walls when exported with `--octagon-walls`; unknown shields and health display their full numeric values.
It starts paused. There is no upload, recording picker, or external viewer link. The generated HTML
bundles the replay and renderer, works without the Theater Lab, and retains its source license notices.
The input to the exporter is `decoded-film.json`, not the original Theater binary. JavaScript and WebGL
are required; retain the early video as a fallback. See the asset folder's README for provenance.
Re-export after changes in `halo_api`; generated viewer HTML is excluded from Prettier.

CloudFront permits same-origin framing only for the hex and motion replay asset directories.
Those viewers have a separate security policy that allows their embedded fonts and blocks network
connections. Other pages retain their framing restrictions. Include the Terraform header changes
when deploying these embeds; the local development server does not enforce CloudFront headers.

## Asset Generation

All three sites share the favicons, app icons, and Open Graph image generated
from `public/logo.svg` and `public/og-banner.svg`. Vite emits the appropriate
static metadata, `robots.txt`, and `sitemap.xml` for each independent site build.

To regenerate the shared assets after editing the SVGs:

```sh
./generate-assets.sh
```

## License

Licensed under either of

- Apache License, Version 2.0
  ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license
  ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, PR title requirements, and validation.

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.

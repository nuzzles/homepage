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

This starts the joint homepage at `/`, using the saved or browser-preferred language
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

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.

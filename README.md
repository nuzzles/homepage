# Homepage

[![Uptime Status](https://img.shields.io/uptimerobot/status/m802358152-3a32dc04dddbd9789a469d21)](https://stats.uptimerobot.com/pTFWZdoTxa)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nuzzles/homepage/ci.yml?logo=github&label=CI)](https://github.com/nuzzles/homepage/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0%2FMIT-blue.svg)](LICENSE-APACHE)

This is the source code for the joint homepage of Spencer Imbleau and Sara Aslani, built with React,
TypeScript, and Vite.

## Development Setup

**Required Tools:**

- [Node.js](https://nodejs.org/) v24.20.0 (latest LTS)
- [pnpm](https://pnpm.io/) v11.25.0+
- [resvg](https://github.com/niclas-AKA-Ansen/resvg) (`cargo install resvg`)

**Installation:**

```sh
pnpm install
```

**Local Development:**

```sh
pnpm dev
```

This starts the joint homepage at `/`. The Spencer and Sara sites are available
locally at `/spencer` and `/sara`; language-prefixed routes such as `/fr/spencer`
and `/fa/sara` work as well.

Profile identity, hostnames, images, contact links, résumé settings, SEO, and translation
keys are defined once in `profiles.json`. The UI, local routes, generated profile pages,
sitemaps, Vite entries, deployment loops, and Terraform all derive from that registry.

## Available Commands

```sh
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm lint     # Run ESLint
pnpm format   # Format project files
pnpm check    # Run formatting, lint, type, and build checks
pnpm preview  # Preview production build locally
```

## Asset Generation

All three sites share the favicons, app icons, and Open Graph image generated
from `public/logo.svg` and `public/og-banner.svg`. The profile directories only
contain their site-specific `robots.txt` and `sitemap.xml` files.

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

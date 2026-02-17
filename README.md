# Personal Website

[![Uptime Status](https://img.shields.io/uptimerobot/status/m802358152-3a32dc04dddbd9789a469d21)](https://stats.uptimerobot.com/pTFWZdoTxa)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nuzzles/homepage/ci.yml?logo=github&label=CI)](https://github.com/nuzzles/homepage/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0%2FMIT-blue.svg)](LICENSE-APACHE)

This is the source code for my personal website built with React, TypeScript, Vite, and Claude.

## Development Setup

**Required Tools:**

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v9+
- [resvg](https://github.com/niclas-AKA-Ansen/resvg) (`cargo install resvg`)

**Installation:**

```sh
pnpm install
```

**Local Development:**

```sh
pnpm dev
```

This will start the development server with hot module replacement enabled.

## Available Commands

```sh
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm lint     # Run ESLint
pnpm preview  # Preview production build locally
```

## Asset Generation

Favicons, OG images, and other assets are generated from two SVG source files:

- `public/logo.svg` - Logo used for favicons, app icons, and tiles
- `public/og-banner.svg` - Open Graph banner image

To regenerate all assets after editing the SVGs:

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

# Project Guide

## Project Overview

This is a joint homepage with separate root, Spencer, and Sara sites, built with React 19, TypeScript, and Vite. The project uses Material-UI for component styling and Emotion for CSS-in-JS.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript 6
- **UI Library**: Material-UI (MUI)
- **Styling**: Emotion (CSS-in-JS)
- **Runtime**: Node.js 24 LTS
- **Package Manager**: pnpm 11
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier

## Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production (TypeScript check + Vite build)
pnpm lint     # Run ESLint
pnpm format   # Format project files
pnpm check    # Run all project checks
pnpm preview  # Preview production build
```

## Project Structure

- `/src` - Source code directory
- `@/` - Path alias that resolves to `./src`
- `profiles.json` - Authoritative profile, hostname, route, contact, and SEO configuration
- `index.html` - Joint homepage entry
- `index-<profile>.html` - Generated profile entries
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration (references app and node configs)

## Code Style & Conventions

### Prettier Configuration

- **Tab Width**: 4 spaces
- **Semicolons**: No semicolons
- **Print Width**: 120 characters
- **Trailing Commas**: ES5 style

### General Guidelines

- Use TypeScript for all source files
- Follow the existing Prettier configuration
- Use the `@/` path alias for importing from src directory
- Ensure ESLint passes before committing

## SEO

This site is SEO-optimized. When adding new pages or routes:

- Define profile data, routes, and SEO metadata in `profiles.json`
- Run `pnpm generate:profiles` to regenerate profile HTML, robots files, and sitemaps
- Use semantic HTML elements where possible

## Theming

When changing theme colors, update all locations where colors are defined:

- `src/theme/` - MUI theme definitions
- `index.html` - `theme-color` and `msapplication-TileColor` meta tags
- `public/site.webmanifest` - `theme_color` and `background_color`

## Working with This Project

### When Making Changes

1. Always run `pnpm lint` to check for linting errors
2. Follow the Prettier formatting rules (4 spaces, no semicolons, 120 char width)
3. Use Material-UI components where appropriate
4. Leverage TypeScript types for type safety

### Package Management

- Use `pnpm` for installing dependencies (NOT npm or yarn)
- Only allowed build scripts: esbuild (as specified in `pnpm-workspace.yaml`)

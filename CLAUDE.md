# Project Guide

## Project Overview

This is a personal website built with React 19, TypeScript, and Vite. The project uses Material-UI for component styling and Emotion for CSS-in-JS.

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Language**: TypeScript 5.9.3
- **UI Library**: Material-UI (MUI) 7.3.1
- **Styling**: Emotion (CSS-in-JS)
- **Package Manager**: pnpm
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier

## Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production (TypeScript check + Vite build)
pnpm lint     # Run ESLint
pnpm preview  # Preview production build
```

## Project Structure

- `/src` - Source code directory
- `@/` - Path alias that resolves to `./src`
- `index.html` - Entry HTML file
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

- Add the new URL to `public/sitemap.xml`
- Ensure `index.html` meta tags (Open Graph, Twitter Card, description) remain accurate and up to date
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
- Only built dependencies: esbuild (as specified in pnpm config)

# Homepage

Joint homepage of Spencer and Sara Imbleau, built with React, TypeScript, and Vite.
Profile blogs use Jekyll. See [README.md](README.md) for setup and
[CONTRIBUTING.md](CONTRIBUTING.md) for branch, PR, and validation conventions.

## Development and build

```sh
pnpm dev                          # joint homepage and profile blogs
HOMEPAGE_SITE=spencer pnpm dev     # Spencer's profile site and blog
HOMEPAGE_SITE=sara pnpm dev        # Sara's profile site and blog
pnpm check                        # formatting, lint, types, tests, and Vite build
HOMEPAGE_SITE=spencer pnpm build   # production profile build, including Jekyll
HOMEPAGE_SITE=sara pnpm build      # production profile build, including Jekyll
```

## Project structure

```text
profiles.json          # profile identity, routes, links, metadata, and translation keys
src/
  App.tsx              # application routes and language layouts
  pages/               # homepage, About, résumé, and How I Work pages
  components/          # shared UI
  i18n/locales/        # English, French, and Persian translations
  siteMetadata.ts      # site metadata, robots.txt, and sitemaps
  components/ui/       # owned shadcn/ui components (Radix primitives)
  index.css            # Tailwind theme tokens and shared page layouts
blogs/
  spencer/             # Spencer's Jekyll blog
  sara/                # Sara's Jekyll blog
  shared/              # shared blog layouts and includes
public/                # static assets and shared blog styles
docs/personal-values.md # Spencer's How I Work reference for blog writing
scripts/               # blog development, build, and replay asset tooling
terraform/             # hosting, redirects, and CloudFront routing
```

## Skills

Project guidance lives in `AGENTS.md`. Blog workflows live in `.agents/skills/`.

- `$start-blog-post` — interview Spencer and develop a writing brief for a new post.
- `$blog-writing` — draft, revise, proofread, or review established English blog prose.

## Writing guidance

When planning, writing, or reviewing Spencer's blog posts, consult his
[How I Work principles](docs/personal-values.md), copied from the résumé repository.
Treat them as chosen commitments, not evidence of past accomplishments. Use them
to guide perspective, tone, and attribution where relevant without forcing every
post to discuss them. Ground claims in concrete, supported actions and outcomes,
and distinguish Spencer's contribution from the team's achievements.

## Language and translation rules

- The blog is English only; blog posts do not need translations.
- The résumé document itself is an English-only PDF. Do not translate the PDF.
- Everything else must be translated into every supported site language: English,
  French, and Persian. This includes the How I Work page and the résumé webpage
  surrounding the embedded PDF, along with navigation, controls, and page metadata.
- Follow the existing language-aware routing pattern for translated pages, including
  unprefixed routes and `/en`, `/fr`, and `/fa` variants. Preserve the selected language
  in internal links and keep routing, metadata, sitemaps, and CloudFront handling consistent.
- Use the existing locale files and language helpers instead of hardcoding English UI copy.

## Important rules

- Do not change `README.md` without explicit permission from the user.
- Keep profile configuration in `profiles.json` and shared behavior reusable across profiles.
- How I Work belongs only to Spencer. Do not expose it as Sara's page or a shared profile page.
- Follow existing UI and routing patterns when adding pages.
- Run focused checks during development and the validation required by `CONTRIBUTING.md`
  before a PR is ready for review. Build each affected profile for profile or blog changes.
- Never commit secrets, dependency directories, or generated build output.

## UI architecture

- Use the owned shadcn/ui components in `src/components/ui/` for buttons, menus,
  and cards. `components.json` configures the registry and aliases.
- Use Tailwind and the semantic CSS variables in `src/index.css`; do not add MUI
  or a second component theme. Keep the cream background and blue primary color.
- Keep the standalone Jekyll theme in `public/blog-theme.css` visually aligned.
- Preserve visible keyboard focus, 44px control targets, reduced-motion support,
  and logical spacing for Persian RTL layouts. Language flag outlines stay black.
- Résumé and How I Work navigation uses a filled primary button for the current
  page and an outlined button for the other page. Link to How I Work from the
  résumé page, not the homepage. Keep its article scrollable with Go back outside.

- Keep bold display headings and properly capitalized controls. Preserve the playful
  portrait corner marks, offset blue frame, name sticker, and decorative motion.
  Motion must be brief and respect reduced-motion preferences.
- Spencer's About page and selected projects live in profile configuration. Project
  descriptions and About copy use all three locale files. Use verified project facts;
  distinguish authorship from maintenance or contributions.
- Keep Resume, Reveal Email, and Schedule 1:1 prominent, with GitHub and LinkedIn
  presented as clear icon-and-name links. Do not add unconfirmed social accounts.

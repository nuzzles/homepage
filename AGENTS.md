# Homepage

Joint homepage of Spencer and Sara Imbleau, built with React, TypeScript, and Vite.
Spencer's blog uses Hugo; Sara has no blog. See [docs/blog-development.md](docs/blog-development.md) for setup and
[CONTRIBUTING.md](CONTRIBUTING.md) for branch, PR, and validation conventions.

## Development and build

```sh
pnpm dev                          # joint homepage and Spencer's blog
HOMEPAGE_SITE=spencer pnpm dev     # Spencer's profile site and blog
HOMEPAGE_SITE=sara pnpm dev        # Sara's profile site
pnpm check                        # formatting, lint, types, tests, and Vite build
HOMEPAGE_SITE=spencer pnpm build   # production profile build, including Hugo
HOMEPAGE_SITE=sara pnpm build      # production profile build, including Hugo
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
blog/                  # Spencer's Hugo blog only
  content/posts/       # English Markdown posts
  layouts/             # Hugo reading layouts and shortcodes
  assets/              # Blog images, diagrams, and demos
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
- The blog language control keeps the English flag and replaces the dropdown caret with an X
  and an “English Only” tooltip (hover, keyboard focus, or tap). Opinion posts use `tags: [opinion]`,
  which adds the sticky “Thinking out loud” banner and Opinion reading metadata.
  Show topic/tag links below Contents; existing categories also appear in the tag archive.
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
  popovers, and cards. `components.json` configures the registry and aliases.
- Use Tailwind and the semantic CSS variables in `src/index.css`; do not add MUI
  or a second component theme. Keep the cream background and blue primary color.
- Header and footer are the same React components on the site and blog. Hugo renders
  them at build time and hydrates them; do not duplicate their markup or styles in templates.
- Font files are declared once in `src/fonts.css`; About and Blog titles and prose share
  `src/typography.css`, loaded through the shared site stylesheet. Change typography there
  so the React and Hugo pages stay consistent; do not reintroduce blog-specific font rules.
- The blog is coupled to Spencer: keep its Hugo config, content, layouts, and assets in
  `blog/`. Do not add profile-generic blog configuration or a Sara blog.
- Preserve visible keyboard focus, 44px control targets, reduced-motion support,
  and logical spacing for Persian RTL layouts. Language flag outlines stay black.
- Résumé and How I Work navigation uses a filled primary button for the current
  page and an outlined button for the other page. Link to How I Work from the
  résumé page, not the homepage. Keep its article scrollable with Go back outside.

- Use readable sentence-case headings and controls; never force uppercase with CSS. Keep the portrait clean: rounded photo, small line-art stars, and a restrained hatch accent.
  Avoid tilted frames, oversized stickers, and corner brackets. Use hand-drawn accents,
  repeating stop-motion star twinkles with discrete rotation steps, and a yellow marker underline on the introduction.
  All motion must respect reduced-motion preferences.
- Spencer's About page and projects live in profile configuration. Project
  descriptions use all three locale files; About prose lives in translated Markdown under `src/content/about/`. Use verified project facts;
  distinguish authorship from maintenance or contributions.
- Keep the horizontal action/social bar ordered GitHub, LinkedIn, Schedule 1:1, Resume,
  then Email. All social-bar icons inherit their link or button text color. Use a PDF icon for Resume and the Calendly logo for scheduling.
  Email opens a centered modal with a blurred backdrop, Compose email and Copy email actions,
  and dismissal on outside click or Escape. Restore focus to the trigger when closed.
  Social-bar hover backgrounds have square corners.
  Do not add unconfirmed social accounts.

- The homepage introduces the profile with a personal greeting and always shows the full
  biography. Do not add a profile dropdown or biography expansion control.
- The profile header links are Blog, then About. The profile name links home;
  do not add separate Home or Projects links to the header.
- Spencer's homepage sections are Latest and Projects. Latest uses Hugo's generated
  published-post feed, with date, title, and description in each row; blog titles and
  excerpts remain English. Project cards contain
  only a title, description, and boxed external-link indicator and open in new tabs.
- Spencer's former blog About URL redirects to his site About page. Keep the blog's
  ownership, contribution, category, and license information on that translated page.

- On the résumé page, group Open PDF beside the download icon and actual PDF file size.
  Keep a translated accessible download label even when its visible text is only the size.

- Use full-width sections with internal padding (3.6vw, minimum 20px), following den.dev.
  Header, hero, action bar, and footer span the viewport; do not inset the entire page.
  Apply the same fluid shell to the blog and document pages.
  Keep prose at a readable line length. Share the spacious grouped-link footer between
  the homepage and About, with a Squiggle around the home-link name in both header and footer.
  Footer credit uses coffee and Claude pixel icons with accessible names.
- `ClaudeMascot` is shared by the site and blog footer. Keep the original local Icons8
  expression SVGs and attribution on About. Track gaze and circles only within the footer and reset circle tracking on exit.
  Support directional eyes, dizziness after two quick nearby circles,
  idle sleep, and click/keyboard happiness; clean up global listeners and timers on unmount.
- Resume links navigate in the same tab through React Router. Schedule 1:1 uses the
  Calendly logo and an external-link arrow and opens in a new tab.

- Keep affiliation icons attached to their link labels as they wrap. About's contents
  can collapse and expand, and indicate the current section while scrolling.

- About prose is authored in `src/content/about/{en,fr,fa}.md`. Preserve stable heading
  anchors and component slots across translations. Blog posts live in `blog/content/posts/`;
  use Hugo shortcodes and keep explicit URLs on migrated posts. See `docs/blog-development.md`.
- Keep the footer cream at every breakpoint; do not tint it with the primary color.

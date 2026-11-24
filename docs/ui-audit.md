# Website UI audit and shadcn refresh

Audited November 24, 2026. The portfolio pairs bold typography and a playful portrait
with a clearer page hierarchy, consistent controls, and dedicated project and About content.
The homepage and About structure take inspiration from [den.dev](https://den.dev),
using this site's own colors, portrait, decorations, and copy.

| Finding                                                                      | Change                                                                                                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lowercase controls and subdued headings weakened the site's personality.     | Capitalized controls, bold Barlow Condensed display headings, and a mustard headline underline.                                                   |
| The portrait lost its distinctive framing.                                   | Offset blue backplate, corner marks, rotated name sticker, star, and drawn scribble; brief entrance motion respects reduced-motion preferences.   |
| A single biography did not provide room for background or project discovery. | Spencer-only About page with a contents sidebar, background, open source, projects, and contact sections; four featured projects on the homepage. |
| Contact links were hard to scan.                                             | GitHub and LinkedIn icon-and-name strip; Resume, Reveal Email, and Schedule 1:1 remain prominent.                                                 |
| Cross-page project links arrived at the top of the homepage.                 | Restore fragment scrolling after React mounts the target sections, with regression coverage.                                                      |
| MUI, custom buttons, and static blog styles duplicated the visual system.    | Owned shadcn/ui buttons, cards, and Radix menus; Tailwind semantic tokens; MUI and Emotion removed. Jekyll retains matching static CSS.           |
| Small controls and weak footer contrast reduced usability.                   | 44px button/menu targets, visible focus rings, readable muted text, and stronger secondary outlines.                                              |
| Document pages lacked an immediate language switch.                          | Language menu beside the résumé/How I Work navigation; filled current page and outlined alternate page.                                           |
| Failed email copying gave no explanation.                                    | Translated success/error feedback; the email link remains usable and timers are cleaned up on unmount.                                            |
| The PDF's direct link appeared only during delayed loading.                  | Persistent Open PDF link and a disabled download button during downloads.                                                                         |
| The blog index lacked a top-level heading.                                   | Latest posts is an h1 when the page has no separate title; post links are h2 headings.                                                            |

![Refreshed Spencer homepage](ui-refresh-homepage.jpg)

![Spencer About page](ui-refresh-about.jpg)

## Content and routing

- Monet, bevy_vello, Trunk, and halo_api are configured in `profiles.json`.
  Descriptions distinguish authorship, maintenance, and contribution. No Mastodon link is added.
- About, projects, navigation, and controls are translated into English, French, and Persian.
  About follows the résumé route conventions, including bare and language-prefixed routes,
  local profile paths, canonical metadata, sitemap entries, and CloudFront routing.
- About and the selected project section belong to Spencer. Sara retains her own profile content.
- How I Work remains accessible through the résumé page, with a bounded scrollable article
  and Go Back outside. Its navigation keeps the filled active and outlined alternate styles.
- Blog content and the résumé PDF remain English only. Blog background remains `#f3eedf`.
- README files were not changed.

## Validation

- `pnpm check`: Prettier, ESLint, TypeScript, 208 tests, and the Vite build.
- `HOMEPAGE_SITE=spencer pnpm build` and `HOMEPAGE_SITE=sara pnpm build`, including Jekyll.
- `terraform -chdir=terraform fmt -check -recursive`,
  `terraform -chdir=terraform init -backend=false -input=false -lockfile=readonly`,
  and `terraform -chdir=terraform validate`.
- Browser checks of the revised portfolio: 1280px homepage and About; 375px homepage;
  320px English, French, and Persian About and Persian projects. Checked horizontal overflow,
  header wrapping, language changes, cross-page project scrolling, email reveal/copy feedback,
  résumé/How I Work button hierarchy, profile-switch destinations, and blog-to-About navigation.
- Earlier refresh checks also covered the joint selector, Sara résumé state, mobile blog index
  and article, keyboard menu opening/Escape/focus return, biography expansion, article scrolling,
  image enlargement/Escape, and the PDF download.
- Theme text contrast calculations: ink on cream 15.39:1, muted text on cream 5.22:1,
  and white on primary blue 7.16:1. These are token checks, not a WCAG certification.

The in-app browser displayed the external résumé iframe but not its PDF contents;
embedded PDF rendering remains a browser-dependent manual check. The direct download
worked. This was a visual and interaction audit, not a comprehensive screen-reader,
physical-device, or cross-browser certification.

## Component maintenance

`components.json` configures shadcn's `new-york` registry and the `@/` aliases.
Button, card, and dropdown-menu source originated from the official
[shadcn registry](https://ui.shadcn.com/r/styles/new-york/button.json).
Local adjustments set 44px control targets, strengthen button focus rings, and omit
menu animations. The upstream MIT notice is retained in `src/components/ui/LICENSE.md`.
Use `src/index.css` for app tokens and shared layouts, and `public/blog-theme.css`
for the corresponding static blog presentation.

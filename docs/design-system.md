# Shared visual system

The site’s visual language takes inspiration from [Anthropic](https://www.anthropic.com/),
inspected November 24, 2026: warm paper surfaces, near-black text, serif display type,
sans-serif navigation and body text, thin borders, generous margins, and restrained controls.
The existing full-width layout, underlined Blog/About navigation, portrait accents,
and stepped animations remain part of this site’s identity.

## Ownership

- `src/design-tokens.css` owns colors, font stacks, type scale, spacing, layout gutters,
  radii, shadows, and motion duration.
- `src/fonts.css` bundles open-source DM Sans and Source Serif 4 variable fonts, with
  Vazirmatn for Persian. Fontsource packages supply the files; licenses ship in `public/fonts/`.
  Font requests stay on the site’s own origin. Anthropic’s proprietary fonts are not used.
- `src/typography.css` shares display and article typography between React and Hugo.
- `src/index.css` maps the tokens to Tailwind and owns site layouts and shared chrome.
- `public/blog-theme.css` and `public/blog-media.css` consume the same tokens.
  Mermaid reads the computed theme tokens; syntax highlighting retains semantic colors.
- The English résumé PDF, article illustrations, and embedded interactive demos are documents
  or media with their own styling. The surrounding site uses the shared theme.

## Tokens

| Role                                | Value                                          |
| ----------------------------------- | ---------------------------------------------- |
| Page / raised surface               | `#faf9f5` / `#f5f4ed`                          |
| Text / secondary text               | `#141413` / `#5e5d59`                          |
| Border / hover surface              | `#dedcd1` / `#e8e6dc`                          |
| Primary control                     | Near-black with warm-white text                |
| Decorative accent                   | Muted terracotta `#c7785b`                     |
| Link hover / focus                  | Dark terracotta `#8a4935`                      |
| Display type                        | Source Serif 4, weight 500, 40–72px            |
| UI and body type                    | DM Sans; Vazirmatn in Persian                  |
| Reading type                        | 18–20px, 1.8 line height, up to 68ch           |
| Spacing scale                       | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px |
| Horizontal gutter                   | 6.25vw, clamped to 20–120px                    |
| Section spacing                     | 56–96px                                        |
| Balanced page banners               | 48–96px; 40px on mobile                        |
| Controls / panels / portrait radius | 10px / 12px / 24px                             |
| Minimum control target              | 44px                                           |

Social-bar cells retain square corners. Blog/About navigation uses an underline for
hover and active states. The name squiggle wiggles on hover/focus, and all animation
respects reduced-motion preferences. Persian uses a dedicated font, natural tracking,
logical spacing, and a more generous heading line height.

Token contrast calculations: primary text on paper 17.50:1, secondary text on paper
6.26:1, secondary text on raised surfaces 5.98:1, primary-button text 17.50:1, and
link-hover text on paper 6.46:1. These are token checks, not a WCAG certification.

Keyboard focus is shared through `src/focus.css`: a square 2px outline in the focus
color, with a 3px gap. Action-bar cells and menu items inset the same outline to
avoid clipping. Focused controls use square corners; buttons do not add a second
box-shadow ring. Every action-bar item uses `SocialBarAction`.

About and How I work share `MarkdownReadingLayout`, including collapsible Contents,
scroll highlighting, and translated Markdown. `ContentHeading` adds accessible `#`
permalinks and uses `MarkerUnderline`, also used by the homepage introduction. Hugo
heading and marker partials emit the same classes; `src/typography.css` owns their
shared appearance. Contents labels omit the decorative permalink character.

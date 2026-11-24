# Website UI audit and shadcn refresh

Updated November 24, 2026. The portfolio and Hugo blog share one React header/footer
and an Anthropic-inspired visual system. See [design-system.md](design-system.md)
for palette, typography, spacing, control tokens, and font licenses.

| Finding                                                 | Current behavior                                                                                                                                                                 |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site and blog drifted visually.                         | Both consume `src/design-tokens.css`, `src/fonts.css`, and `src/typography.css`; Hugo renders and hydrates the shared React chrome.                                              |
| Heavy headings and saturated colors dominated the page. | Serif display type, sans-serif body/UI type, warm paper surfaces, near-black controls, and muted decorative accents.                                                             |
| Spacing and shapes were inconsistent.                   | Shared spacing scale, fluid gutters, balanced banners, readable prose widths, restrained borders, and reusable control/panel radii.                                              |
| Narrow social bars crowded their actions.               | Five columns on wide screens, three/two at intermediate widths, and two columns with a full-width Email row on phones. Each action keeps inner padding and square hover corners. |
| Email was awkward to access.                            | Centered modal with blur, Compose email and Copy email actions, translated copy feedback, outside-click/Escape dismissal, and focus restoration.                                 |
| Portrait decorations were excessive.                    | Rounded photo, restrained hand-drawn hatch, outlined stars with discrete twinkles, and an introduction marker underline.                                                         |
| Homepage structure was noisy.                           | Full biography, Latest and Projects sections, simple project cards, and underlined Blog/About navigation. Profile name returns home.                                             |
| Blog discovery and navigation were limited.             | Homepage feed, grouped year archive, collapsible contents and active headings, topic links, and a five-post timeline that continues to the edge when additional posts exist.     |
| Opinion posts needed context.                           | Sticky Thinking out loud notice, reading metadata, and compact listing badges.                                                                                                   |
| About content was duplicated.                           | Translated Markdown on Spencer’s site; former blog About redirects there.                                                                                                        |
| Footer details did not align.                           | Shared footer with compact pixel coffee/Clawd, stepped steam, footer-only pointer tracking, and accessible interactions.                                                         |

## Interaction and accessibility

- Preserve 44px targets, visible focus, keyboard operation, reduced motion, and Persian RTL.
- Blog and résumé PDF remain English-only; the surrounding site UI is translated.
- Social order: GitHub, LinkedIn, Schedule 1:1, Resume, Email. Social icons inherit text color.
- Resume navigates through React Router. External project/social links open new tabs.
- Résumé and How I Work remain paired pages with matching primary/secondary navigation.
- No profile switcher, extra Home/Projects header links, or biography expansion control.
- The footer keeps the same paper surface at all breakpoints.

## Validation

Run `pnpm check`, `HOMEPAGE_SITE=spencer pnpm build`, and `HOMEPAGE_SITE=sara pnpm build`.
Browser checks cover desktop and narrow layouts, shared About/Blog typography,
translated layouts, the email modal, navigation, social-bar sizing, and the footer.
The PDF frame’s contents depend on the browser’s PDF viewer; the download and page
controls are independently usable.

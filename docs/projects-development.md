# Featured projects

Spencer’s Projects page uses `profiles.json` as its project list. Projects with a
`feature` appear as linked editorial spreads; the rest use the homepage cards.
The homepage keeps its existing external project links.

A feature provides a stable URL slug, cover image, translated image description
and category keys, and a modification date. Its page lives at `/projects/<slug>`,
with the usual `/en`, `/fr`, and `/fa` language variants. Add prose under
`src/content/projects/<slug>/{en,fr,fa}.md`. Use stable section anchors like
`## The project {#overview}`; the shared Markdown reading layout supplies Contents
and heading permalinks. Markdown images, links, lists, tables, and code work here
as they do on About. Update the feature’s modification date when its content changes.

The initial pages have short factual descriptions for expansion.

Cover sources:

- Monet: screenshot of <https://monet3d.com>.
- bevy_vello: tiger example from <https://github.com/linebender/bevy_vello>.
- halo_api: Theater packet inspector from the existing Halo reverse-engineering post.

The WebP covers in `public/projects/` are optimized copies of those images.

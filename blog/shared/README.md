# Shared blog features

Paths and commands below are relative to the repository root. See [profile blog setup](../README.md)
for development and build commands.

## Shared blog media

Both profile blogs load `public/blog-media.css` and `public/blog-media.js` through the shared
`blogs/shared/_includes/blog-assets.html` include. Standard post images gain a keyboard-accessible
lightbox automatically. Links to image files open their full-size image; images linking to other
pages keep their normal navigation. Modified clicks retain the browser's usual link behavior.

Figure spacing and captions, image viewing, and Mermaid controls are shared across posts. A post
does not need `halo-theater.css` to use them. The existing Homelab post uses these shared figure
styles and has no post-specific CSS.

Use `stylesheets` in a post's front matter for styles that belong only to that post:

```yaml
stylesheets:
    - /assets/css/my-post.css
```

The profile build versions shared and post-specific stylesheets by content; development uses the
source files. New profile blogs should link `blog-assets.html` and `mermaid.html` from
`blogs/shared/_includes/` into their `_includes/`, and include `blog-assets.html` from their head.

## Mermaid diagrams in profile blogs

Store diagram files under the profile's `assets/diagrams/` directory, then pass the blog-relative path to the include:

```liquid
{% include mermaid.html
   file="/assets/diagrams/halo-theater-structure.mermaid"
   title="From film to frame"
   description="The film's chunks, packets, and bit-packed records." %}
```

`file` is required; `title` and `description` are optional. The include applies the current blog base path,
so use `/assets/…` without adding `/blog`. A post can include multiple diagrams. Put `accTitle` and
`accDescr` in each Mermaid file to describe the diagram for screen readers. Each embed starts fitted
to its canvas and has zoom in/out, Fit, and 100% controls. Drag to pan; Ctrl/⌘ + scroll zooms at the
pointer while ordinary scrolling moves the page. With the canvas focused, use +/− to zoom, arrow
keys to pan, F to fit, and 0 to reset to natural size. Touch dragging also pans the diagram.
Each viewer keeps its own zoom and position. Captions use the same small type as the hex viewer.

Mermaid is installed at a pinned version and served locally, only on pages with an embed. The profile
build creates a separate renderer bundle; `pnpm dev` serves the TypeScript entry through Vite.
Use `HOMEPAGE_SITE=spencer pnpm build` from the repository root when previewing static output; Jekyll alone does not build the renderer.
If JavaScript is disabled, the caption and diagram-source link remain available. Loading or syntax
errors display a message in the affected figure without preventing other diagrams from rendering.

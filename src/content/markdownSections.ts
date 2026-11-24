// Explicit anchors keep incoming links stable when translated headings change.
export const parseMarkdownSections = (source: string) =>
    [...source.matchAll(/^## (.+) \{#([\w-]+)\}\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(([, title, id, body]) => ({
        title,
        id,
        body,
    }))

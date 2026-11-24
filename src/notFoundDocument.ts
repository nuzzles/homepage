// Reuse the site's entry point, asset URLs, and profile identity for static-host errors.
export function notFoundDocument(html: string): string {
    return html
        .replace(/<title>[^<]*<\/title>/, "<title>404</title>")
        .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, follow">')
}

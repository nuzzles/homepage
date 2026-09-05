import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { format } from "prettier"
import profiles from "../profiles.json" with { type: "json" }

const root = resolve(import.meta.dirname, "..")
const languages = [
    { prefix: "", hreflang: "en-US" },
    { prefix: "/fr", hreflang: "fr" },
    { prefix: "/fa", hreflang: "fa" },
]

const html = (value) =>
    value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

const englishList = (values) => new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(values)

const selectorHtml = () => {
    const entries = Object.values(profiles)
    const firstNames = englishList(entries.map(({ firstName }) => firstName))
    const fullNames = englishList(entries.map(({ fullName }) => fullName))
    const title = `${firstNames} | Homepage`
    const description = `This is the joint homepage of ${firstNames}.`

    return `<!doctype html>
<html lang="en-US" data-site="selector">
    <head>
        <title>${html(title)}</title>

        <meta charset="UTF-8" />
        <meta content="ie=edge" http-equiv="x-ua-compatible" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes" />
        <meta name="robots" content="index, follow" />
        <meta name="description" content="${html(description)}" />
        <meta name="title" content="${html(title)}" />
        <meta name="author" content="${html(fullNames)}" />

        <meta property="og:site_name" content="${html(firstNames)}" />
        <meta property="og:title" content="${html(firstNames)}" />
        <meta property="og:description" content="${html(description)}" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://imbleau.com" />
        <meta property="og:image" content="https://imbleau.com/og-banner.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content="Imbleau" />

        <meta name="twitter:title" content="${html(title)}" />
        <meta name="twitter:description" content="${html(description)}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://imbleau.com/og-banner.png" />

        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#F3EEDF" />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="canonical" href="https://imbleau.com" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        <link rel="alternate" hreflang="en-US" href="https://imbleau.com/" />
        <link rel="alternate" hreflang="x-default" href="https://imbleau.com/" />
        <link rel="alternate" hreflang="fr" href="https://imbleau.com/fr/" />
        <link rel="alternate" hreflang="fa" href="https://imbleau.com/fa/" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
        />
    </head>
    <body>
        <noscript>
            <h1>${html(firstNames)}</h1>
            <p>${html(description)} Enable JavaScript to continue.</p>
        </noscript>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
    </body>
</html>
`
}

const profileHtml = (id, profile) => {
    const hostname = profile.hostnames.prod
    const baseUrl = `https://${hostname}`
    const title = `${profile.fullName} | Homepage`
    const { staticMeta } = profile
    const twitterHandle = staticMeta.twitterHandle
        ? `
        <meta name="twitter:site" content="${html(staticMeta.twitterHandle)}" />
        <meta name="twitter:creator" content="${html(staticMeta.twitterHandle)}" />`
        : ""
    const mastodon = staticMeta.mastodonUrl
        ? `
        <link rel="me" href="${html(staticMeta.mastodonUrl)}" />`
        : ""

    return `<!doctype html>
<html lang="en-US" data-site="${id}">
    <head>
        <title>${html(title)}</title>

        <meta charset="UTF-8" />
        <meta content="ie=edge" http-equiv="x-ua-compatible" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="description" content="${html(staticMeta.description)}" />
        <meta name="title" content="${html(title)}" />
        <meta name="keywords" content="${html(staticMeta.keywords)}" />
        <meta name="author" content="${html(profile.fullName)}" />
        <meta name="copyright" content="${html(profile.fullName)}" />

        <meta property="og:site_name" content="${html(profile.fullName)}" />
        <meta property="og:title" content="${html(profile.fullName)}" />
        <meta property="og:description" content="${html(staticMeta.description)}" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="${baseUrl}" />
        <meta property="og:image" content="${baseUrl}/og-banner.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content="Imbleau" />

        <meta name="twitter:title" content="${html(profile.fullName)}" />
        <meta name="twitter:description" content="${html(staticMeta.twitterDescription)}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="${baseUrl}/og-banner.png" />${twitterHandle}

        <meta name="color-scheme" content="light" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#F3EEDF" />
        <meta name="msapplication-TileColor" content="#F3EEDF" />${mastodon}

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="canonical" href="${baseUrl}" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        <link rel="alternate" hreflang="en-US" href="${baseUrl}/" />
        <link rel="alternate" hreflang="x-default" href="${baseUrl}/" />
        <link rel="alternate" hreflang="fr" href="${baseUrl}/fr/" />
        <link rel="alternate" hreflang="fa" href="${baseUrl}/fa/" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
        />
    </head>
    <body>
        <noscript>
            <h1>${html(profile.fullName)}</h1>
            <p>${html(staticMeta.noscriptRole)}. Enable JavaScript to view this site.</p>
        </noscript>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
    </body>
</html>
`
}

const localizedUrl = (baseUrl, language, route) => {
    const path = `${language.prefix}${route === "/" ? "/" : route}`
    return `${baseUrl}${path}`
}

const sitemap = (profile) => {
    const baseUrl = `https://${profile.hostnames.prod}`
    const pages = [{ route: "/", lastModified: profile.lastModified, priority: "1.0" }]
    if (profile.resume) {
        pages.push({ route: "/resume", lastModified: profile.resume.lastModified, priority: "0.8" })
    }

    const urls = languages.flatMap((language) =>
        pages.map(
            (page) => `    <url>
        <loc>${localizedUrl(baseUrl, language, page.route)}</loc>
${languages
    .map(
        (alternate) =>
            `        <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${localizedUrl(baseUrl, alternate, page.route)}" />`
    )
    .join("\n")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(baseUrl, languages[0], page.route)}" />
        <lastmod>${page.lastModified}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${language.prefix ? (Number(page.priority) - 0.2).toFixed(1) : page.priority}</priority>
    </url>`
        )
    )

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`
}

const selectorEntryHtml = await format(selectorHtml(), {
    parser: "html",
    tabWidth: 4,
    printWidth: 120,
})
await writeFile(resolve(root, "index.html"), selectorEntryHtml)

for (const [id, profile] of Object.entries(profiles)) {
    const publicDirectory = resolve(root, "public", id)
    const entryHtml = await format(profileHtml(id, profile), {
        parser: "html",
        tabWidth: 4,
        printWidth: 120,
    })
    await mkdir(publicDirectory, { recursive: true })
    await Promise.all([
        writeFile(resolve(root, `index-${id}.html`), entryHtml),
        writeFile(
            resolve(publicDirectory, "robots.txt"),
            `User-agent: *\nAllow: /\n\nSitemap: https://${profile.hostnames.prod}/sitemap.xml\n`
        ),
        writeFile(resolve(publicDirectory, "sitemap.xml"), sitemap(profile)),
    ])
}

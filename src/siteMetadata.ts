import {
    getCanonicalProfileUrl,
    getProfile,
    isProfileId,
    PROFILE_ENTRIES,
    PROFILE_IDS,
    type ProfileId,
} from "./profiles.ts"

export type BuildSite = "selector" | ProfileId

export const BUILD_SITES: BuildSite[] = ["selector", ...PROFILE_IDS]

const languages = [
    { prefix: "", hreflang: "en-US" },
    { prefix: "/fr", hreflang: "fr" },
    { prefix: "/fa", hreflang: "fa" },
] as const

export interface StaticSiteMetadata {
    id: BuildSite
    baseUrl: string
    title: string
    siteName: string
    description: string
    twitterDescription: string
    author: string
    type: "website" | "profile"
    keywords?: string
    twitterHandle?: string
    mastodonUrl?: string
}

export function isBuildSite(value: string | undefined): value is BuildSite {
    return value === "selector" || isProfileId(value)
}

export function getStaticSiteMetadata(site: BuildSite): StaticSiteMetadata {
    if (site === "selector") {
        const firstNames = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
            PROFILE_ENTRIES.map(({ firstName }) => firstName)
        )
        const fullNames = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
            PROFILE_ENTRIES.map(({ fullName }) => fullName)
        )

        return {
            id: site,
            baseUrl: "https://imbleau.com",
            title: `${firstNames} | Homepage`,
            siteName: firstNames,
            description: `This is the joint homepage of ${firstNames}.`,
            twitterDescription: `This is the joint homepage of ${firstNames}.`,
            author: fullNames,
            type: "website",
        }
    }

    const profile = getProfile(site)
    return {
        id: site,
        baseUrl: getCanonicalProfileUrl(site),
        title: `${profile.fullName} | Homepage`,
        siteName: profile.fullName,
        description: profile.staticMeta.description,
        twitterDescription: profile.staticMeta.twitterDescription,
        author: profile.fullName,
        type: "profile",
        keywords: profile.staticMeta.keywords,
        twitterHandle: profile.staticMeta.twitterHandle,
        mastodonUrl: profile.staticMeta.mastodonUrl,
    }
}

export function getAlternateUrls(site: BuildSite) {
    const { baseUrl } = getStaticSiteMetadata(site)
    return [
        ...languages.map(({ prefix, hreflang }) => ({ hreflang, href: `${baseUrl}${prefix}/` })),
        { hreflang: "x-default", href: `${baseUrl}/` },
    ]
}

const localizedUrl = (baseUrl: string, prefix: string, route: string) =>
    `${baseUrl}${prefix}${route === "/" ? "/" : route}`

export function getRobotsTxt(site: BuildSite): string {
    return `User-agent: *\nAllow: /\n\nSitemap: ${getStaticSiteMetadata(site).baseUrl}/sitemap.xml\n`
}

export function getSitemapXml(site: BuildSite): string {
    const metadata = getStaticSiteMetadata(site)
    const profile = site === "selector" ? null : getProfile(site)
    const lastModified = profile
        ? profile.lastModified
        : PROFILE_ENTRIES.map(({ lastModified }) => lastModified)
              .sort()
              .at(-1)!
    const pages = [{ route: "/", lastModified, priority: "1.0" }]

    if (profile?.resume) {
        pages.push({ route: "/resume", lastModified: profile.resume.lastModified, priority: "0.8" })
    }

    const urls = languages.flatMap((language) =>
        pages.map((page) => {
            const alternates = languages
                .map(
                    (alternate) =>
                        `        <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${localizedUrl(metadata.baseUrl, alternate.prefix, page.route)}" />`
                )
                .join("\n")
            const priority = language.prefix ? (Number(page.priority) - 0.2).toFixed(1) : page.priority

            return `    <url>
        <loc>${localizedUrl(metadata.baseUrl, language.prefix, page.route)}</loc>
${alternates}
        <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(metadata.baseUrl, "", page.route)}" />
        <lastmod>${page.lastModified}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${priority}</priority>
    </url>`
        })
    )

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`
}

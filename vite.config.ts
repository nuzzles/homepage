import { defineConfig, type HtmlTagDescriptor, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import {
    getAlternateUrls,
    getRobotsTxt,
    getSitemapXml,
    getStaticSiteMetadata,
    isBuildSite,
    type BuildSite,
} from "./src/siteMetadata.ts"
import { getProfile, PROFILE_CARD_IMAGE_SIZES, PROFILE_ENTRIES, PROFILE_HERO_IMAGE_SIZES } from "./src/profiles.ts"

const meta = (name: string, content: string): HtmlTagDescriptor => ({
    tag: "meta",
    attrs: { name, content },
    injectTo: "head",
})

const property = (name: string, content: string): HtmlTagDescriptor => ({
    tag: "meta",
    attrs: { property: name, content },
    injectTo: "head",
})

const sitePlugin = (site: BuildSite, documentSite: BuildSite | "local"): Plugin => {
    const metadata = getStaticSiteMetadata(site)
    const image = `${metadata.baseUrl}/og-banner.png`
    const profileImages = site === "selector" ? PROFILE_ENTRIES : [getProfile(site)]
    const profileImageSizes = site === "selector" ? PROFILE_CARD_IMAGE_SIZES : PROFILE_HERO_IMAGE_SIZES

    return {
        name: "homepage-site",
        transformIndexHtml: {
            order: "pre",
            handler(html) {
                const tags: HtmlTagDescriptor[] = [
                    ...profileImages.map<HtmlTagDescriptor>((profile) => ({
                        tag: "link",
                        attrs: {
                            rel: "preload",
                            as: "image",
                            href: profile.image,
                            imagesrcset: profile.imageSrcSet,
                            imagesizes: profileImageSizes,
                            fetchpriority: "high",
                        },
                        injectTo: "head",
                    })),
                    meta("robots", "index, follow"),
                    meta("description", metadata.description),
                    meta("title", metadata.title),
                    meta("author", metadata.author),
                    property("og:site_name", metadata.siteName),
                    property("og:title", metadata.siteName),
                    property("og:description", metadata.description),
                    property("og:locale", "en_US"),
                    property("og:type", metadata.type),
                    property("og:url", metadata.baseUrl),
                    property("og:image", image),
                    property("og:image:width", "1280"),
                    property("og:image:height", "640"),
                    property("og:image:alt", "Imbleau"),
                    meta("twitter:title", metadata.title),
                    meta("twitter:description", metadata.twitterDescription),
                    meta("twitter:card", "summary_large_image"),
                    meta("twitter:image", image),
                    {
                        tag: "link",
                        attrs: { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
                        injectTo: "head",
                    },
                    ...getAlternateUrls(site).map<HtmlTagDescriptor>(({ hreflang, href }) => ({
                        tag: "link",
                        attrs: { rel: "alternate", hreflang, href },
                        injectTo: "head",
                    })),
                ]

                if (metadata.keywords) tags.push(meta("keywords", metadata.keywords))
                if (metadata.twitterHandle) {
                    tags.push(
                        meta("twitter:site", metadata.twitterHandle),
                        meta("twitter:creator", metadata.twitterHandle)
                    )
                }
                if (metadata.mastodonUrl) {
                    tags.push({
                        tag: "link",
                        attrs: { rel: "me", href: metadata.mastodonUrl },
                        injectTo: "head",
                    })
                }

                return {
                    html: html
                        .replace('data-site="local"', `data-site="${documentSite}"`)
                        .replace("<title>Homepage</title>", `<title>${metadata.title}</title>`),
                    tags,
                }
            },
        },
        generateBundle() {
            this.emitFile({ type: "asset", fileName: "robots.txt", source: getRobotsTxt(site) })
            this.emitFile({ type: "asset", fileName: "sitemap.xml", source: getSitemapXml(site) })
        },
    }
}

export default defineConfig(({ command }) => {
    const requestedSite = process.env.HOMEPAGE_SITE
    if (requestedSite && !isBuildSite(requestedSite)) {
        throw new Error(`Unknown HOMEPAGE_SITE: ${requestedSite}`)
    }
    const site: BuildSite = isBuildSite(requestedSite) ? requestedSite : "selector"
    const documentSite = command === "serve" && !requestedSite ? "local" : site
    const blogProxyPath = process.env.HOMEPAGE_BLOG_PROXY_PATH

    return {
        clearScreen: false,
        plugins: [react(), sitePlugin(site, documentSite)],
        server: blogProxyPath
            ? {
                  proxy: {
                      [blogProxyPath]: {
                          target: "http://127.0.0.1:4001",
                      },
                  },
              }
            : undefined,
        build: {
            rolldownOptions: {
                output: {
                    codeSplitting: {
                        groups: [
                            {
                                name: "react",
                                test: /node_modules[\\/](react|react-dom|react-router|scheduler)/,
                                priority: 30,
                            },
                            {
                                name: "mui",
                                test: /node_modules[\\/](@mui|@emotion)/,
                                priority: 20,
                            },
                            {
                                name: "i18n",
                                test: /node_modules[\\/](i18next|react-i18next)/,
                                priority: 10,
                            },
                            {
                                name: "vendor",
                                test: /node_modules/,
                            },
                        ],
                    },
                },
            },
        },
        resolve: {
            alias: {
                "@": import.meta.dirname + "/src",
            },
        },
    }
})

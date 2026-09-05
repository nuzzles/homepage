import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { PROFILE_ENTRIES } from "@/profiles"
import { BUILD_SITES, getRobotsTxt, getSitemapXml, getStaticSiteMetadata } from "@/siteMetadata"

const readEntry = (filename: string) => readFileSync(resolve(import.meta.dirname, "..", filename), "utf8")

describe("static Open Graph metadata", () => {
    it("uses one shared Imbleau asset set", () => {
        const logo = readEntry("public/logo.svg")
        const banner = readEntry("public/og-banner.svg")

        expect(logo).toContain('aria-label="IM"')
        expect(banner).toContain('aria-label="IM"')
        expect(banner).toContain('aria-label="IMBLEAU"')
        expect(logo).not.toContain('aria-label="SI"')
        expect(logo).not.toContain('aria-label="SA"')
    })

    it.each(PROFILE_ENTRIES)("builds $fullName metadata for the $id site", ({ id, fullName, hostnames }) => {
        const metadata = getStaticSiteMetadata(id)

        expect(metadata.siteName).toBe(fullName)
        expect(metadata.baseUrl).toBe(`https://${hostnames.prod}`)
        expect(metadata.type).toBe("profile")
        expect(getRobotsTxt(id)).toContain(`${metadata.baseUrl}/sitemap.xml`)
        expect(getSitemapXml(id)).toContain(`<loc>${metadata.baseUrl}/</loc>`)
    })

    it("builds joint metadata for the selector", () => {
        const profileNames = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
            PROFILE_ENTRIES.map(({ firstName }) => firstName)
        )
        const metadata = getStaticSiteMetadata("selector")

        expect(metadata.siteName).toBe(profileNames)
        expect(metadata.baseUrl).toBe("https://imbleau.com")
        expect(metadata.description).toBe(`This is the joint homepage of ${profileNames}.`)
        expect(metadata.type).toBe("website")
    })

    it("emits robots and sitemap files for every independently built site", () => {
        for (const site of BUILD_SITES) {
            expect(getRobotsTxt(site)).toContain("User-agent: *")
            expect(getSitemapXml(site)).toContain("<urlset")
        }
        expect(getSitemapXml("sara")).not.toContain("/resume")
        expect(getSitemapXml("spencer")).toContain("/resume")
    })
})

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { getCanonicalProfileUrl, PROFILE_ENTRIES } from "@/profiles"

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

    it.each(PROFILE_ENTRIES)("serves $fullName metadata only from the $id entry", ({ id, fullName }) => {
        const html = readEntry(`index-${id}.html`)
        const profileUrl = getCanonicalProfileUrl(id)

        expect(html).toContain(`property="og:site_name" content="${fullName}"`)
        expect(html).toContain(`content="${profileUrl}/og-banner.png"`)
        expect(html).toContain('href="/favicon.svg"')
        expect(html).toContain('href="/site.webmanifest"')

        for (const otherProfile of PROFILE_ENTRIES.filter((profile) => profile.id !== id)) {
            expect(html).not.toContain(otherProfile.hostnames.prod)
        }
    })

    it("serves joint metadata from the root entry", () => {
        const html = readEntry("index.html")
        const profileNames = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
            PROFILE_ENTRIES.map(({ firstName }) => firstName)
        )

        expect(html).toContain(`property="og:site_name" content="${profileNames}"`)
        expect(html).toContain('property="og:url" content="https://imbleau.com"')
        expect(html).toContain('content="https://imbleau.com/og-banner.png"')
        expect(html).toContain('href="/favicon.svg"')
        expect(html).toContain('href="/site.webmanifest"')
        expect(html).toContain(`This is the joint homepage of ${profileNames}.`)
        expect(html).not.toContain("Choose between")
        for (const profile of PROFILE_ENTRIES) {
            expect(html).not.toContain(profile.hostnames.prod)
        }
    })
})

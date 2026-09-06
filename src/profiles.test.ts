import { describe, expect, it } from "vitest"
import { getActiveProfile, getProfileHomePath, getProfileSwitchUrl, profileHasResume, type ProfileId } from "@/profiles"
import en from "@/i18n/locales/en.json"
import fa from "@/i18n/locales/fa.json"
import fr from "@/i18n/locales/fr.json"

describe("profile switch URLs", () => {
    it.each([
        ["https://spencer.imbleau.com/", "sara", "https://sara.imbleau.com/"],
        ["https://sara.imbleau.com/", "spencer", "https://spencer.imbleau.com/"],
        ["https://imbleau.com/", "sara", "https://sara.imbleau.com/"],
        ["https://dev.imbleau.com/fa", "spencer", "https://spencer-dev.imbleau.com/fa"],
        ["https://stg.imbleau.com/fr", "sara", "https://sara-stg.imbleau.com/fr"],
        ["https://spencer-dev.imbleau.com/fa", "sara", "https://sara-dev.imbleau.com/fa"],
        ["https://sara-stg.imbleau.com/fr", "spencer", "https://spencer-stg.imbleau.com/fr"],
        [
            "https://spencer-dev.imbleau.com/fa/resume?download=true#experience",
            "sara",
            "https://sara-dev.imbleau.com/fa/resume?download=true#experience",
        ],
    ] satisfies [string, ProfileId, string][])("switches %s to %s", (currentUrl, profile, expected) => {
        expect(getProfileSwitchUrl(currentUrl, profile)).toBe(expected)
    })

    it("leaves local profile switching to client state", () => {
        expect(getProfileSwitchUrl("http://localhost:5173/fa", "sara")).toBeNull()
    })
})

describe("resume availability", () => {
    it.each(["sara.imbleau.com", "sara-dev.imbleau.com", "sara-stg.imbleau.com"])(
        "does not expose a résumé for %s",
        (hostname) => {
            expect(getActiveProfile(hostname)).toBe("sara")
            expect(profileHasResume("sara")).toBe(false)
        }
    )

    it.each(["spencer.imbleau.com", "spencer-dev.imbleau.com", "spencer-stg.imbleau.com"])(
        "keeps the résumé for %s",
        (hostname) => {
            expect(getActiveProfile(hostname)).toBe("spencer")
            expect(profileHasResume("spencer")).toBe(true)
        }
    )

    it("does not assume a profile for the root or an unknown hostname", () => {
        expect(getActiveProfile("imbleau.com")).toBeNull()
        expect(getActiveProfile("localhost")).toBeNull()
        expect(getActiveProfile("example.com")).toBeNull()
    })
})

describe("profile home paths", () => {
    it.each([
        ["localhost", "spencer", "/spencer"],
        ["127.0.0.1", "sara", "/sara"],
        ["spencer.imbleau.com", "spencer", "/"],
        ["sara-dev.imbleau.com", "sara", "/"],
    ] satisfies [string, ProfileId, string][])('uses "%s" for %s', (hostname, profile, expected) => {
        expect(getProfileHomePath(hostname, profile)).toBe(expected)
    })
})

describe("profile-neutral résumé copy", () => {
    it.each([en, fr, fa])("interpolates profile names instead of hardcoding one profile", ({ resumePage }) => {
        const copy = JSON.stringify(resumePage)

        expect(copy).toContain("{{profile}}")
        expect(copy).not.toContain("Spencer Imbleau")
        expect(copy).not.toContain("Sara Imbleau")
    })
})

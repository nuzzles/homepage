import { describe, expect, it } from "vitest"
import { getActiveProfile, getProfileSwitchUrl, profileHasResume, type ProfileId } from "@/profiles"

describe("profile switch URLs", () => {
    it.each([
        ["https://spencer.imbleau.com/", "sara", "https://sara.imbleau.com/"],
        ["https://sara.imbleau.com/", "spencer", "https://spencer.imbleau.com/"],
        ["https://dev.spencer.imbleau.com/fa", "sara", "https://dev.sara.imbleau.com/fa"],
        ["https://stg.sara.imbleau.com/fr", "spencer", "https://stg.spencer.imbleau.com/fr"],
        [
            "https://dev.spencer.imbleau.com/fa/resume?download=true#experience",
            "sara",
            "https://dev.sara.imbleau.com/fa/resume?download=true#experience",
        ],
    ] satisfies [string, ProfileId, string][])("switches %s to %s", (currentUrl, profile, expected) => {
        expect(getProfileSwitchUrl(currentUrl, profile)).toBe(expected)
    })

    it("leaves local profile switching to client state", () => {
        expect(getProfileSwitchUrl("http://localhost:5173/fa", "sara")).toBeNull()
    })
})

describe("resume availability", () => {
    it.each(["sara.imbleau.com", "dev.sara.imbleau.com", "stg.sara.imbleau.com"])(
        "does not expose a résumé for %s",
        (hostname) => {
            expect(profileHasResume(getActiveProfile(hostname))).toBe(false)
        }
    )

    it.each(["spencer.imbleau.com", "dev.spencer.imbleau.com", "stg.spencer.imbleau.com"])(
        "keeps the résumé for %s",
        (hostname) => {
            expect(profileHasResume(getActiveProfile(hostname))).toBe(true)
        }
    )

    it("respects the selected localhost profile", () => {
        expect(profileHasResume(getActiveProfile("localhost", "sara"))).toBe(false)
        expect(profileHasResume(getActiveProfile("localhost", "spencer"))).toBe(true)
    })
})

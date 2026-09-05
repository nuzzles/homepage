import { describe, expect, it } from "vitest"
import { getActiveProfile, getProfileSwitchUrl, profileHasResume, type ProfileId } from "@/profiles"

describe("profile switch URLs", () => {
    it.each([
        ["https://spencer.imbleau.com/", "sara", "https://sara.imbleau.com/"],
        ["https://sara.imbleau.com/", "spencer", "https://spencer.imbleau.com/"],
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
            expect(profileHasResume(getActiveProfile(hostname))).toBe(false)
        }
    )

    it.each(["spencer.imbleau.com", "spencer-dev.imbleau.com", "spencer-stg.imbleau.com"])(
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

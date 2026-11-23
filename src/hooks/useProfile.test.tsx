import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { ProfileProvider } from "@/components/ProfileProvider"
import { useProfile } from "@/hooks/useProfile"
import type { ProfileId } from "@/profiles"

const ProfileSummary = () => {
    const profile = useProfile()
    return <span data-profile={profile.id}>{`${profile.fullName}|${profile.canonicalUrl}`}</span>
}

describe("useProfile", () => {
    it.each([
        ["spencer", "Spencer Imbleau", "https://spencer.imbleau.com"],
        ["sara", "Sara Imbleau", "https://sara.imbleau.com"],
    ] satisfies [ProfileId, string, string][])(
        "provides the configured %s profile",
        (profileId, fullName, canonicalUrl) => {
            const markup = renderToStaticMarkup(
                <ProfileProvider profileId={profileId}>
                    <ProfileSummary />
                </ProfileProvider>
            )

            expect(markup).toContain(`data-profile="${profileId}"`)
            expect(markup).toContain(`${fullName}|${canonicalUrl}`)
        }
    )

    it("fails clearly outside a profile route", () => {
        expect(() => renderToStaticMarkup(<ProfileSummary />)).toThrow(
            "useProfile must be used within a ProfileProvider"
        )
    })
})

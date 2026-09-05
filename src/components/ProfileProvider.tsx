import { useMemo, type ReactNode } from "react"
import { ProfileContext } from "@/profileContext"
import { getCanonicalProfileUrl, getProfile, type ProfileId } from "@/profiles"

export const ProfileProvider = ({ profileId, children }: { profileId: ProfileId; children: ReactNode }) => {
    const profile = useMemo(
        () => ({ id: profileId, canonicalUrl: getCanonicalProfileUrl(profileId), ...getProfile(profileId) }),
        [profileId]
    )

    return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>
}

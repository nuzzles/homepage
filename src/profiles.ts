export type ProfileId = "spencer" | "sara"

const PROFILE_HOSTNAME = /^(spencer|sara)(?:-(dev|stg))?\.imbleau\.com$/i

export function isLocalProfileHostname(hostname: string): boolean {
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

export function getProfileFromHostname(hostname: string): ProfileId | null {
    const profile = PROFILE_HOSTNAME.exec(hostname)?.[1]?.toLowerCase()
    if (profile === "spencer" || profile === "sara") return profile
    return null
}

export function getActiveProfile(hostname: string, selectedLocalProfile: string | null = null): ProfileId {
    const hostnameProfile = getProfileFromHostname(hostname)
    if (hostnameProfile) return hostnameProfile
    if (isLocalProfileHostname(hostname) && selectedLocalProfile === "sara") return "sara"
    return "spencer"
}

export function profileHasResume(profile: ProfileId): boolean {
    return profile === "spencer"
}

export function getProfileHostname(hostname: string, profile: ProfileId): string | null {
    const match = PROFILE_HOSTNAME.exec(hostname)
    if (!match) return null

    const environment = match[2]?.toLowerCase()
    return `${profile}${environment ? `-${environment}` : ""}.imbleau.com`
}

export function getProfileSwitchUrl(currentHref: string, profile: ProfileId): string | null {
    const nextUrl = new URL(currentHref)
    const nextHostname = getProfileHostname(nextUrl.hostname, profile)
    if (!nextHostname) return null

    nextUrl.hostname = nextHostname
    return nextUrl.toString()
}

export function getCanonicalProfileUrl(profile: ProfileId): string {
    return `https://${profile}.imbleau.com`
}

export type ProfileId = "spencer" | "sara"

const PROFILE_HOSTNAME = /^(?:(dev|stg)\.)?(spencer|sara)\.imbleau\.com$/i

export function isLocalProfileHostname(hostname: string): boolean {
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

export function getProfileFromHostname(hostname: string): ProfileId | null {
    const profile = PROFILE_HOSTNAME.exec(hostname)?.[2]?.toLowerCase()
    if (profile === "spencer" || profile === "sara") return profile
    return null
}

export function getProfileHostname(hostname: string, profile: ProfileId): string | null {
    const match = PROFILE_HOSTNAME.exec(hostname)
    if (!match) return null

    const environment = match[1]?.toLowerCase()
    return `${environment ? `${environment}.` : ""}${profile}.imbleau.com`
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

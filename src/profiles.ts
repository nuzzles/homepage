import rawConfig from "../profiles.json" with { type: "json" }

export type SocialKind = "linkedin" | "github"
export type DeploymentEnvironment = "dev" | "stg" | "prod"

export interface SocialLink {
    kind: SocialKind
    label: string
    href: string
}

export interface ResumeConfig {
    pdfUrl: string
    embedUrl: string
    downloadFilename: string
    lastModified: string
}

export interface StaticProfileMeta {
    description: string
    twitterDescription: string
    keywords: string
    noscriptRole: string
    twitterHandle?: string
    mastodonUrl?: string
}

export interface ProfileConfig {
    firstName: string
    fullName: string
    primaryInfrastructure?: boolean
    hostnames: Record<DeploymentEnvironment, string>
    image: string
    imageSrcSet: string
    encodedEmail: string
    roleKey: string
    stickerKey: string
    metaKey: string
    nationality?: string
    calendlyUrl?: string
    staticMeta: StaticProfileMeta
    lastModified: string
    resume: ResumeConfig | null
    socials: readonly SocialLink[]
}

const config = rawConfig as Record<keyof typeof rawConfig, ProfileConfig>

export type ProfileId = keyof typeof config

export const PROFILE_CONFIG: Readonly<Record<ProfileId, ProfileConfig>> = config
export const PROFILE_IDS = Object.keys(config) as ProfileId[]
export const PROFILE_ENTRIES = PROFILE_IDS.map((id) => ({ id, ...PROFILE_CONFIG[id] }))
export const PROFILE_OPTIONS = PROFILE_ENTRIES.map(({ id, fullName }) => ({ id, name: fullName }))

const SELECTOR_HOSTNAME = /^(?:(dev|stg)\.)?imbleau\.com$/i

export function isProfileId(value: unknown): value is ProfileId {
    return typeof value === "string" && Object.hasOwn(config, value)
}

export function getProfile(profile: ProfileId): ProfileConfig {
    return PROFILE_CONFIG[profile]
}

export function isLocalProfileHostname(hostname: string): boolean {
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

function getProfileHostMatch(hostname: string): { profile: ProfileId; environment: DeploymentEnvironment } | null {
    const normalizedHostname = hostname.toLowerCase()

    for (const profile of PROFILE_IDS) {
        for (const environment of ["dev", "stg", "prod"] as const) {
            if (normalizedHostname === PROFILE_CONFIG[profile].hostnames[environment].toLowerCase()) {
                return { profile, environment }
            }
        }
    }

    return null
}

export function getProfileFromHostname(hostname: string): ProfileId | null {
    return getProfileHostMatch(hostname)?.profile ?? null
}

export function getActiveProfile(hostname: string): ProfileId | null {
    return getProfileFromHostname(hostname)
}

export function profileHasResume(profile: ProfileId): boolean {
    return PROFILE_CONFIG[profile].resume !== null
}

export function getProfileHomePath(hostname: string, profile: ProfileId): string {
    return isLocalProfileHostname(hostname) ? `/${profile}` : "/"
}

export function getProfileHostname(hostname: string, profile: ProfileId): string | null {
    const profileMatch = getProfileHostMatch(hostname)
    const selectorMatch = SELECTOR_HOSTNAME.exec(hostname)
    if (!profileMatch && !selectorMatch) return null

    const environment = profileMatch?.environment ?? selectorMatch?.[1]?.toLowerCase() ?? "prod"
    return PROFILE_CONFIG[profile].hostnames[environment as DeploymentEnvironment]
}

export function getProfileSwitchUrl(currentHref: string, profile: ProfileId): string | null {
    const nextUrl = new URL(currentHref)
    const nextHostname = getProfileHostname(nextUrl.hostname, profile)
    if (!nextHostname) return null

    nextUrl.hostname = nextHostname
    return nextUrl.toString()
}

export function getCanonicalProfileUrl(profile: ProfileId): string {
    return `https://${PROFILE_CONFIG[profile].hostnames.prod}`
}

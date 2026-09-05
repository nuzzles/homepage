import { languageConfig } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

const PREFERENCE_NAME = "preferredLanguage"
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
    return value !== null && value in languageConfig
}

function readCookie(): string | null {
    const prefix = `${PREFERENCE_NAME}=`
    const cookie = document.cookie.split("; ").find((entry) => entry.startsWith(prefix))
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

export function savePreferredLanguage(language: SupportedLanguage): void {
    localStorage.setItem(PREFERENCE_NAME, language)

    const attributes = [
        `${PREFERENCE_NAME}=${encodeURIComponent(language)}`,
        "Path=/",
        `Max-Age=${ONE_YEAR_IN_SECONDS}`,
        "SameSite=Lax",
    ]

    const hostname = window.location.hostname.toLowerCase()
    if (hostname === "imbleau.com" || hostname.endsWith(".imbleau.com")) {
        attributes.push("Domain=imbleau.com")
    }
    if (window.location.protocol === "https:") {
        attributes.push("Secure")
    }

    document.cookie = attributes.join("; ")
}

export function readPreferredLanguage(): SupportedLanguage | null {
    const cookieLanguage = readCookie()
    if (isSupportedLanguage(cookieLanguage)) {
        return cookieLanguage
    }

    const localLanguage = localStorage.getItem(PREFERENCE_NAME)
    if (isSupportedLanguage(localLanguage)) {
        savePreferredLanguage(localLanguage)
        return localLanguage
    }

    return null
}

export function detectBrowserLanguage(browserLanguages: readonly string[]): SupportedLanguage {
    for (const browserLanguage of browserLanguages) {
        const lower = browserLanguage.toLowerCase()
        for (const [language, config] of Object.entries(languageConfig)) {
            if (lower.startsWith(config.browserPrefix)) {
                return language as SupportedLanguage
            }
        }
    }

    return "en"
}

export function resolvePreferredLanguage(
    browserLanguages: readonly string[] = navigator.languages ?? [navigator.language]
): SupportedLanguage {
    const stored = readPreferredLanguage()
    if (stored) return stored

    const detected = detectBrowserLanguage(browserLanguages)
    savePreferredLanguage(detected)
    return detected
}

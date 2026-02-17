import { Navigate } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { useLanguage } from "@/hooks/useLanguage"
import { languageConfig, defaultLanguage, getUrlPrefix } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

function detectBrowserLanguage(): SupportedLanguage {
    const browserLangs = navigator.languages ?? [navigator.language]
    for (const browserLang of browserLangs) {
        const lower = browserLang.toLowerCase()
        for (const [lang, config] of Object.entries(languageConfig)) {
            if (lower.startsWith(config.browserPrefix)) {
                return lang as SupportedLanguage
            }
        }
    }
    return defaultLanguage
}

function getPreferredLanguage(): SupportedLanguage {
    const stored = localStorage.getItem("preferredLanguage")
    if (stored && stored in languageConfig) {
        return stored as SupportedLanguage
    }
    return detectBrowserLanguage()
}

export const LanguageRedirect = () => {
    const { language, setLanguage } = useLanguage()
    const detected = getPreferredLanguage()

    // Set language synchronously so the first render uses correct translations
    if (language !== detected) {
        setLanguage(detected)
    }

    if (detected !== defaultLanguage) {
        return <Navigate to={`${getUrlPrefix(detected)}/`} replace />
    }

    return <HomePage />
}

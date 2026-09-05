import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { useLanguage } from "@/hooks/useLanguage"
import { languageConfig, defaultLanguage, getUrlPrefix } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"
import { readPreferredLanguage, savePreferredLanguage } from "@/i18n/languagePreference"

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
    const stored = readPreferredLanguage()
    if (stored) {
        return stored
    }

    const detected = detectBrowserLanguage()
    savePreferredLanguage(detected)
    return detected
}

export const LanguageRedirect = () => {
    const { language, setLanguage } = useLanguage()
    const detected = getPreferredLanguage()

    useEffect(() => {
        setLanguage(detected)
    }, [detected, setLanguage])

    if (language !== detected) {
        return null
    }

    if (detected !== defaultLanguage) {
        return <Navigate to={`${getUrlPrefix(detected)}/`} replace />
    }

    return <HomePage />
}

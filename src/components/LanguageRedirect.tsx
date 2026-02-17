import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { HomePage } from "@/pages/HomePage"
import { languageConfig, defaultLanguage, getHtmlLang, getDir, getUrlPrefix } from "@/i18n/i18n"
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
    const { i18n } = useTranslation()
    const detected = getPreferredLanguage()

    // Change language synchronously so the first render uses correct translations
    if (i18n.language !== detected) {
        i18n.changeLanguage(detected)
    }

    useEffect(() => {
        document.documentElement.setAttribute("lang", getHtmlLang(detected))
        document.documentElement.setAttribute("dir", getDir(detected))
    }, [detected])

    if (detected !== defaultLanguage) {
        return <Navigate to={`${getUrlPrefix(detected)}/`} replace />
    }

    return <HomePage />
}

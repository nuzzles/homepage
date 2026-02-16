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
            if (lang !== defaultLanguage && lower.startsWith(config.browserPrefix)) {
                return lang as SupportedLanguage
            }
        }
    }
    return defaultLanguage
}

export const LanguageRedirect = () => {
    const { i18n } = useTranslation()
    const detected = detectBrowserLanguage()

    useEffect(() => {
        if (detected === defaultLanguage) {
            i18n.changeLanguage(defaultLanguage)
            document.documentElement.setAttribute("lang", getHtmlLang(defaultLanguage))
            document.documentElement.setAttribute("dir", getDir(defaultLanguage))
        }
    }, [detected, i18n])

    if (detected !== defaultLanguage) {
        return <Navigate to={`${getUrlPrefix(detected)}/`} replace />
    }

    return <HomePage />
}

import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { getUrlPrefix, getHtmlLang, getDir, getLanguageSwitchPath } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"
import { savePreferredLanguage } from "@/i18n/languagePreference"

export function useLanguage() {
    const { t, i18n } = useTranslation()
    const location = useLocation()

    const language = i18n.language as SupportedLanguage
    const prefix = getUrlPrefix(language)

    // Sync document attributes whenever language changes
    useEffect(() => {
        document.documentElement.setAttribute("lang", getHtmlLang(language))
        document.documentElement.setAttribute("dir", getDir(language))
    }, [language])

    // Set language (route-driven, no persistence or navigation)
    const setLanguage = useCallback(
        (lang: SupportedLanguage) => {
            if (i18n.language !== lang) {
                i18n.changeLanguage(lang)
            }
        },
        [i18n]
    )

    const languageHref = useCallback(
        (lang: SupportedLanguage) => getLanguageSwitchPath(location.pathname, lang),
        [location.pathname]
    )

    // The anchor handles navigation; this only persists the explicit choice.
    const rememberLanguage = useCallback((lang: SupportedLanguage) => savePreferredLanguage(lang), [])

    // Build a localized path for the current language
    const localizedPath = useCallback(
        (path: string) => {
            if (path === "/") return prefix || "/"
            return `${prefix}${path}`
        },
        [prefix]
    )

    return { language, prefix, t, setLanguage, languageHref, rememberLanguage, localizedPath }
}

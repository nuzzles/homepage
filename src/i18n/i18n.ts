import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./locales/en.json"
import fr from "./locales/fr.json"
import fa from "./locales/fa.json"
import { defaultLanguage, languageConfig, type SupportedLanguage } from "./languages"

export {
    defaultLanguage,
    languageConfig,
    supportedLanguages,
    type LanguageConfig,
    type SupportedLanguage,
} from "./languages"

// ─── Language Configuration ──────────────────────────────────────────────────

// ─── Utility Functions ───────────────────────────────────────────────────────

export function getUrlPrefix(lang: SupportedLanguage): string {
    return languageConfig[lang].urlPrefix
}

export function getHtmlLang(lang: SupportedLanguage): string {
    return languageConfig[lang].htmlLang
}

export function getDir(lang: SupportedLanguage): "ltr" | "rtl" {
    return languageConfig[lang].dir
}

export function getLanguageFromPath(pathname: string): SupportedLanguage {
    const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase()
    if (firstSegment && firstSegment in languageConfig) {
        return firstSegment as SupportedLanguage
    }
    for (const [lang, config] of Object.entries(languageConfig)) {
        if (config.urlPrefix && config.urlPrefix === `/${firstSegment}`) {
            return lang as SupportedLanguage
        }
    }
    return defaultLanguage
}

export function stripLanguagePrefix(pathname: string): string {
    const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase()
    if (firstSegment && firstSegment in languageConfig) {
        return pathname.slice(firstSegment.length + 1) || "/"
    }
    for (const config of Object.values(languageConfig)) {
        if (config.urlPrefix && pathname.startsWith(config.urlPrefix)) {
            return pathname.slice(config.urlPrefix.length) || "/"
        }
    }
    return pathname
}

export function getLanguageSwitchPath(pathname: string, language: SupportedLanguage): string {
    const basePath = stripLanguagePrefix(pathname)
    const prefix = getUrlPrefix(language)
    return basePath === "/" ? prefix || "/" : `${prefix}${basePath}`
}

export function getLanguageRedirectPath(pathname: string, language: SupportedLanguage): string {
    const prefix = getUrlPrefix(language)
    return pathname === "/" ? `${prefix}/` : `${prefix}${pathname}`
}

// ─── i18next Initialization ──────────────────────────────────────────────────

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        fr: { translation: fr },
        fa: { translation: fa },
    },
    lng: getLanguageFromPath(window.location.pathname),
    fallbackLng: defaultLanguage,
    interpolation: {
        escapeValue: false,
    },
})

export default i18n

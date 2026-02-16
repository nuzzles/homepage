import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./locales/en.json"
import fr from "./locales/fr.json"
import fa from "./locales/fa.json"

// ─── Language Configuration ──────────────────────────────────────────────────

export interface LanguageConfig {
    urlPrefix: string
    htmlLang: string
    browserPrefix: string
    dir: "ltr" | "rtl"
}

export const languageConfig: Record<string, LanguageConfig> = {
    en: { urlPrefix: "", htmlLang: "en-US", browserPrefix: "en", dir: "ltr" },
    fr: { urlPrefix: "/fr", htmlLang: "fr-FR", browserPrefix: "fr", dir: "ltr" },
    fa: { urlPrefix: "/fa", htmlLang: "fa-IR", browserPrefix: "fa", dir: "rtl" },
}

export type SupportedLanguage = keyof typeof languageConfig
export const supportedLanguages = Object.keys(languageConfig) as SupportedLanguage[]
export const defaultLanguage: SupportedLanguage = "en"

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
    for (const [lang, config] of Object.entries(languageConfig)) {
        if (config.urlPrefix && config.urlPrefix === `/${firstSegment}`) {
            return lang as SupportedLanguage
        }
    }
    return defaultLanguage
}

export function stripLanguagePrefix(pathname: string): string {
    for (const config of Object.values(languageConfig)) {
        if (config.urlPrefix && pathname.startsWith(config.urlPrefix)) {
            return pathname.slice(config.urlPrefix.length) || "/"
        }
    }
    return pathname
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

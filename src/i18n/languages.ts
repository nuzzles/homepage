export interface LanguageConfig {
    urlPrefix: string
    htmlLang: string
    hreflang: string
    browserPrefix: string
    dir: "ltr" | "rtl"
}

export const languageConfig = {
    en: { urlPrefix: "/en", htmlLang: "en-US", hreflang: "en-US", browserPrefix: "en", dir: "ltr" },
    fr: { urlPrefix: "/fr", htmlLang: "fr-FR", hreflang: "fr", browserPrefix: "fr", dir: "ltr" },
    fa: { urlPrefix: "/fa", htmlLang: "fa-IR", hreflang: "fa", browserPrefix: "fa", dir: "rtl" },
} as const satisfies Record<string, LanguageConfig>

export type SupportedLanguage = keyof typeof languageConfig
export const supportedLanguages = Object.keys(languageConfig) as SupportedLanguage[]
export const defaultLanguage: SupportedLanguage = "en"

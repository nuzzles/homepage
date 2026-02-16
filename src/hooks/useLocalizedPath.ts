import { useTranslation } from "react-i18next"
import { getUrlPrefix } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

export function useLocalizedPath() {
    const { i18n } = useTranslation()
    const prefix = getUrlPrefix(i18n.language as SupportedLanguage)

    return (path: string) => {
        if (path === "/") return prefix || "/"
        return `${prefix}${path}`
    }
}

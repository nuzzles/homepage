import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getHtmlLang, getDir } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

export const LocalizedLayout = ({ lang }: { lang: SupportedLanguage }) => {
    const { i18n } = useTranslation()

    useEffect(() => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang)
        }
        document.documentElement.setAttribute("lang", getHtmlLang(lang))
        document.documentElement.setAttribute("dir", getDir(lang))
    }, [lang, i18n])

    return <Outlet />
}

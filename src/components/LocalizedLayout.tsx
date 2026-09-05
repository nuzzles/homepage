import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import type { SupportedLanguage } from "@/i18n/i18n"
import { savePreferredLanguage } from "@/i18n/languagePreference"

export const LocalizedLayout = ({ lang }: { lang: SupportedLanguage }) => {
    const { setLanguage } = useLanguage()

    useEffect(() => {
        savePreferredLanguage(lang)
        setLanguage(lang)
    }, [lang, setLanguage])

    return <Outlet />
}

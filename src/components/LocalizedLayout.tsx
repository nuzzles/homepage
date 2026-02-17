import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import type { SupportedLanguage } from "@/i18n/i18n"

export const LocalizedLayout = ({ lang }: { lang: SupportedLanguage }) => {
    const { setLanguage } = useLanguage()

    useEffect(() => {
        setLanguage(lang)
    }, [lang, setLanguage])

    return <Outlet />
}

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import { resolvePreferredLanguage } from "@/i18n/languagePreference"

export const PreferredLanguageLayout = () => {
    const { language, setLanguage } = useLanguage()
    const preferredLanguage = resolvePreferredLanguage()

    useEffect(() => {
        setLanguage(preferredLanguage)
    }, [preferredLanguage, setLanguage])

    if (language !== preferredLanguage) {
        return null
    }

    return <Outlet />
}

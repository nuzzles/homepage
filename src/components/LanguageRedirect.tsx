import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { useLanguage } from "@/hooks/useLanguage"
import { defaultLanguage, getUrlPrefix } from "@/i18n/i18n"
import { resolvePreferredLanguage } from "@/i18n/languagePreference"

export const LanguageRedirect = () => {
    const { language, setLanguage } = useLanguage()
    const detected = resolvePreferredLanguage()

    useEffect(() => {
        setLanguage(detected)
    }, [detected, setLanguage])

    if (language !== detected) {
        return null
    }

    if (detected !== defaultLanguage) {
        return <Navigate to={`${getUrlPrefix(detected)}/`} replace />
    }

    return <HomePage />
}

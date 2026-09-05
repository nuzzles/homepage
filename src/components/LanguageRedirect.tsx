import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import { getLanguageRedirectPath } from "@/i18n/i18n"
import { resolvePreferredLanguage } from "@/i18n/languagePreference"

export const LanguageRedirect = ({ path = "/" }: { path?: string }) => {
    const { language, setLanguage } = useLanguage()
    const detected = resolvePreferredLanguage()

    useEffect(() => {
        setLanguage(detected)
    }, [detected, setLanguage])

    if (language !== detected) {
        return null
    }

    return <Navigate to={getLanguageRedirectPath(path, detected)} replace />
}

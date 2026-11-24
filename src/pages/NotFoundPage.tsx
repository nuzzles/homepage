import { Helmet } from "react-helmet-async"
import { Link, useLocation } from "react-router-dom"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileFooter } from "@/components/ProfileFooter"
import { ProfileProvider } from "@/components/ProfileProvider"
import { useLanguage } from "@/hooks/useLanguage"
import { getProfileHomePath, isProfileId } from "@/profiles"
import { stripLanguagePrefix } from "@/i18n/i18n"
import { getConfiguredSite } from "@/site"

export function NotFoundPage() {
    const { t, localizedPath } = useLanguage()
    const { pathname } = useLocation()
    const site = getConfiguredSite()
    const localProfile = stripLanguagePrefix(pathname).split("/")[1]
    const profile = isProfileId(site) ? site : site === "local" && isProfileId(localProfile) ? localProfile : null
    const home = localizedPath(profile ? getProfileHomePath(window.location.hostname, profile) : "/")
    const page = (
        <div className="profile-page portfolio-page">
            <Helmet>
                <title>{t("notFound.title")}</title>
                <meta name="robots" content="noindex, follow" />
                <meta name="description" content={t("notFound.description")} />
            </Helmet>
            {profile ? (
                <ProfileHeader current="none" />
            ) : (
                <header className="profile-header">
                    <Link className="profile-brand" to={home}>
                        Imbleau
                    </Link>
                    <LanguageSwitcher />
                </header>
            )}
            <section className="about-banner">
                <h1>{t("notFound.title")}</h1>
                <p>{t("notFound.description")}</p>
                <Link className="inline-flex min-h-11 items-center underline" to={home}>
                    {t("notFound.goHome")}
                </Link>
            </section>
            {profile && <ProfileFooter />}
        </div>
    )
    return profile ? <ProfileProvider profileId={profile}>{page}</ProfileProvider> : page
}

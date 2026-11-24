import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath, getProfileBlogPath, isProfileId } from "@/profiles"
import { getConfiguredSite } from "@/site"

export const ProfileHeader = ({ current = "home" }: { current?: "home" | "about" }) => {
    const { t, localizedPath } = useLanguage()
    const profile = useProfile()
    const site = getConfiguredSite()
    const home = localizedPath(getProfileHomePath(window.location.hostname, profile.id))
    const base = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    const blog = getProfileBlogPath(window.location.hostname, profile.id, isProfileId(site) ? site : null)
    return (
        <header className="profile-header site-navigation">
            <a className="profile-brand" href={home}>
                {profile.firstName}
            </a>
            <nav aria-label={t("navigation.label")} className="site-nav-links">
                {profile.blog?.showOnHomepage && blog && <a href={blog}>{t("home.blog")}</a>}
                {profile.about && (
                    <a
                        href={localizedPath(`${base}${profile.about.path}`)}
                        aria-current={current === "about" ? "page" : undefined}
                    >
                        {t("navigation.about")}
                    </a>
                )}
            </nav>
            <LanguageSwitcher />
        </header>
    )
}

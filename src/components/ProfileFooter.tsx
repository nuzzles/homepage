import { Coffee } from "lucide-react"
import { Link } from "react-router-dom"
import { Trans } from "react-i18next"
import { ProfileSocials } from "@/components/ProfileSocials"
import { Squiggle } from "@/components/Squiggle"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath, getProfileBlogPath, isProfileId } from "@/profiles"
import { getConfiguredSite } from "@/site"

export const ProfileFooter = () => {
    const { t, localizedPath } = useLanguage()
    const profile = useProfile()
    const site = getConfiguredSite()
    const home = localizedPath(getProfileHomePath(window.location.hostname, profile.id))
    const base = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    const blog = getProfileBlogPath(window.location.hostname, profile.id, isProfileId(site) ? site : null)
    return (
        <footer className="profile-footer">
            <div className="footer-identity">
                <Link className="profile-brand" to={home}>
                    <Squiggle>{profile.firstName}</Squiggle>
                </Link>
                <p>{t(profile.roleKey)}</p>
                <p>
                    © {new Date().getFullYear()} {profile.fullName}
                </p>
                <p className="footer-credit">
                    <Trans
                        t={t}
                        i18nKey="footer.credit"
                        components={{
                            coffee: <Coffee role="img" aria-label={t("footer.coffee")} className="footer-coffee" />,
                            claude: <img src="/images/claude-pixel.svg" className="claude-pixel" alt="Claude" />,
                        }}
                    />
                </p>
            </div>
            <nav className="footer-links" aria-label={t("footer.navigation")}>
                {profile.blog?.showOnHomepage && blog && <a href={blog}>{t("home.blog")}</a>}
                {profile.about && (
                    <Link to={localizedPath(`${base}${profile.about.path}`)}>{t("navigation.about")}</Link>
                )}
                {profile.resume && <Link to={localizedPath(`${base}/resume`)}>{t("home.resume")}</Link>}
            </nav>
            <ProfileSocials />
        </footer>
    )
}

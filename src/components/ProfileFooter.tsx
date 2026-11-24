import { Coffee } from "lucide-react"
import { Link } from "react-router-dom"
import { Trans } from "react-i18next"
import { ProfileSocials } from "@/components/ProfileSocials"
import { Squiggle } from "@/components/Squiggle"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { useProfileNavigation } from "@/hooks/useProfileNavigation"

export const ProfileFooter = () => {
    const { t } = useLanguage()
    const profile = useProfile()
    const { home, about, resume, blog, reloadDocument } = useProfileNavigation()
    return (
        <footer className="profile-footer">
            <div className="footer-identity">
                <Link className="profile-brand" to={home} reloadDocument={reloadDocument}>
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
                {blog && <a href={blog}>{t("home.blog")}</a>}
                {about && (
                    <Link to={about} reloadDocument={reloadDocument}>
                        {t("navigation.about")}
                    </Link>
                )}
                {resume && (
                    <Link to={resume} reloadDocument={reloadDocument}>
                        {t("home.resume")}
                    </Link>
                )}
            </nav>
            <ProfileSocials />
        </footer>
    )
}

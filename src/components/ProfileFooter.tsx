import { Link } from "react-router-dom"
import { Trans } from "react-i18next"
import { ProfileSocials } from "@/components/ProfileSocials"
import { Squiggle } from "@/components/Squiggle"
import { ClaudeMascot } from "@/components/ClaudeMascot"
import { PixelCoffee } from "@/components/PixelCoffee"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { useProfileNavigation } from "@/hooks/useProfileNavigation"

export const ProfileFooter = ({ compact = false }: { compact?: boolean }) => {
    const { t } = useLanguage()
    const profile = useProfile()
    const { home, about, resume, howIWork, readingList, blog, reloadDocument } = useProfileNavigation()
    return (
        <footer className={`profile-footer${compact ? " profile-footer-compact" : ""}`}>
            <div className="footer-identity">
                {!compact && (
                    <>
                        <Link className="profile-brand" to={home} reloadDocument={reloadDocument}>
                            <Squiggle>{profile.firstName}</Squiggle>
                        </Link>
                        <p>{t(profile.roleKey)}</p>
                    </>
                )}
                <p>
                    © 2019–{new Date().getFullYear()} {profile.fullName}
                </p>
                <p className="footer-credit">
                    <Trans
                        t={t}
                        i18nKey="footer.credit"
                        components={{
                            coffee: <PixelCoffee label={t("footer.coffee")} />,
                            claude: <ClaudeMascot />,
                        }}
                    />
                </p>
            </div>
            {!compact && (
                <>
                    <nav
                        className={`footer-links${blog ? " footer-links-grouped" : ""}`}
                        aria-label={t("footer.navigation")}
                    >
                        <div className="footer-link-group">
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
                            {howIWork && profile.howIWork && (
                                <Link to={howIWork} reloadDocument={reloadDocument}>
                                    {t(profile.howIWork.titleKey)}
                                </Link>
                            )}
                        </div>
                        {blog && (
                            <div className="footer-link-group">
                                <a href={`${blog.replace(/\/$/, "")}/stats/`}>{t("navigation.blogStats")}</a>
                                {readingList && (
                                    <Link to={readingList} reloadDocument={reloadDocument}>
                                        {t("readingListPage.title")}
                                    </Link>
                                )}
                                <a href={`${blog.replace(/\/$/, "")}/tags/`}>{t("navigation.tags")}</a>
                            </div>
                        )}
                    </nav>
                    <ProfileSocials />
                </>
            )}
        </footer>
    )
}

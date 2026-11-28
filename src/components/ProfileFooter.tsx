import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
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
                {profile.footerBackToTop && (
                    <Button
                        type="button"
                        variant="ghost"
                        className="min-h-13 w-full max-w-80 justify-between gap-6 whitespace-normal rounded-none border-t border-foreground p-0 text-start text-base text-foreground hover:bg-transparent hover:[&>span]:underline [&_svg]:size-[22px]"
                        aria-label={t("footer.backToTop")}
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: "instant" })
                            document
                                .querySelector<HTMLAnchorElement>(".site-navigation .profile-brand")
                                ?.focus({ preventScroll: true })
                        }}
                    >
                        <span className="underline-offset-4">{t("footer.backToTop")}</span>
                        <ArrowUp aria-hidden="true" strokeWidth={1.6} />
                    </Button>
                )}
            </div>
            {!compact && (
                <>
                    <nav className="footer-links" aria-label={t("footer.navigation")}>
                        {blog && <a href={blog}>{t("home.blog")}</a>}
                        {about && (
                            <Link to={about} reloadDocument={reloadDocument}>
                                {t("navigation.about")}
                            </Link>
                        )}
                        {resume && (
                            <Link className="footer-link-resume" to={resume} reloadDocument={reloadDocument}>
                                {t("home.resume")}
                            </Link>
                        )}
                        {howIWork && profile.howIWork && (
                            <Link className="footer-link-how-i-work" to={howIWork} reloadDocument={reloadDocument}>
                                {t(profile.howIWork.titleKey)}
                            </Link>
                        )}
                        {blog && (
                            <a className="footer-link-stats" href={`${blog.replace(/\/$/, "")}/stats/`}>
                                {t("navigation.blogStats")}
                            </a>
                        )}
                        {readingList && (
                            <Link className="footer-link-reading" to={readingList} reloadDocument={reloadDocument}>
                                {t("readingListPage.title")}
                            </Link>
                        )}
                        {blog && <a href={`${blog.replace(/\/$/, "")}/tags/`}>{t("navigation.tags")}</a>}
                    </nav>
                    <ProfileSocials />
                </>
            )}
        </footer>
    )
}

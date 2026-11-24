import { Link } from "react-router-dom"
import { Squiggle } from "@/components/Squiggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { useProfileNavigation } from "@/hooks/useProfileNavigation"

export const ProfileHeader = ({ current = "home" }: { current?: "home" | "about" | "blog" | "none" }) => {
    const { t } = useLanguage()
    const profile = useProfile()
    const { home, about, blog, reloadDocument } = useProfileNavigation()
    return (
        <header className="profile-header site-navigation">
            <Link className="profile-brand" to={home} reloadDocument={reloadDocument}>
                <Squiggle>{profile.firstName}</Squiggle>
            </Link>
            <nav aria-label={t("navigation.label")} className="site-nav-links">
                {blog && (
                    <a href={blog} aria-current={current === "blog" ? "page" : undefined}>
                        {t("home.blog")}
                    </a>
                )}
                {about && (
                    <Link
                        to={about}
                        reloadDocument={reloadDocument}
                        aria-current={current === "about" ? "page" : undefined}
                    >
                        {t("navigation.about")}
                    </Link>
                )}
            </nav>
            <LanguageSwitcher englishOnly={current === "blog"} />
        </header>
    )
}

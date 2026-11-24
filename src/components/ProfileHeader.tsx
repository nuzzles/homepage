import { Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ProfileSwitcher } from "@/components/ProfileSwitcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import {
    getProfileHomePath,
    getProfileBlogPath,
    getProfileSwitchUrl,
    getSelectorUrl,
    isLocalProfileHostname,
    isProfileId,
    type ProfileId,
} from "@/profiles"
import { getConfiguredSite } from "@/site"

export const ProfileHeader = ({ current = "home" }: { current?: "home" | "about" }) => {
    const { t, localizedPath, routePrefix } = useLanguage()
    const profile = useProfile()
    const site = getConfiguredSite()
    const home = localizedPath(getProfileHomePath(window.location.hostname, profile.id))
    const base = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    const blog = getProfileBlogPath(window.location.hostname, profile.id, isProfileId(site) ? site : null)
    const selectorPath = routePrefix ? `${routePrefix}/` : "/"
    const selectorHref =
        isLocalProfileHostname(window.location.hostname) && site === "local"
            ? localizedPath("/")
            : (getSelectorUrl(window.location.href, selectorPath) ?? `https://imbleau.com${selectorPath}`)
    const hrefForProfile = (next: ProfileId) => {
        const url = getProfileSwitchUrl(window.location.href, next)
        // About belongs to Spencer; profile switching always lands on the other homepage.
        if (url) {
            const target = new URL(url)
            target.pathname = `${routePrefix}/`
            target.search = ""
            target.hash = ""
            return target.href
        }
        return localizedPath(`/${next}`)
    }
    return (
        <header className="profile-header site-navigation">
            <div className="profile-brand">
                <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground">
                    <a href={selectorHref} aria-label={t("home.backToSelector")}>
                        <Undo2 aria-hidden="true" className="rtl:scale-x-[-1]" />
                    </a>
                </Button>
                <ProfileSwitcher
                    value={profile.id}
                    label={t("profileSwitcher.label")}
                    hrefForProfile={hrefForProfile}
                />
            </div>
            <nav aria-label={t("navigation.label")} className="site-nav-links">
                <a href={home} aria-current={current === "home" ? "page" : undefined}>
                    {t("navigation.home")}
                </a>
                {profile.about && (
                    <a
                        href={localizedPath(`${base}${profile.about.path}`)}
                        aria-current={current === "about" ? "page" : undefined}
                    >
                        {t("navigation.about")}
                    </a>
                )}
                {profile.projects?.length ? <a href={`${home}#projects`}>{t("navigation.projects")}</a> : null}
                {profile.blog?.showOnHomepage && blog && <a href={blog}>{t("home.blog")}</a>}
            </nav>
            <LanguageSwitcher />
        </header>
    )
}

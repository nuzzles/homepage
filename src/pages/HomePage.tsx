import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Calendar, Check, Copy, FileText, Mail, Coffee, Feather, Keyboard, Undo2 } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Trans, useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRust, faLinkedin, faSquareGithub } from "@fortawesome/free-brands-svg-icons"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { ProfileSwitcher } from "@/components/ProfileSwitcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import {
    getProfileBlogPath,
    getSelectorUrl,
    getProfileSwitchUrl,
    isLocalProfileHostname,
    isProfileId,
    PROFILE_HERO_IMAGE_SIZES,
    type ProfileId,
} from "@/profiles"
import { getConfiguredSite } from "@/site"

const AffiliationLink = ({ href, icon, children }: { href: string; icon: ReactNode; children?: ReactNode }) => (
    <a href={href} className="affiliation">
        <span aria-hidden="true" className="affiliation-icon">
            {icon}
        </span>
        {children}
    </a>
)
const affiliationIcon = (name: string) => <img src={`/images/affiliations/${name}.svg`} alt="" />

const RevealEmailButton = ({ encodedEmail }: { encodedEmail: string }) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState<string | null>(null)
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    useEffect(() => () => clearTimeout(timer.current), [])
    const handleCopy = async () => {
        if (!email) return
        clearTimeout(timer.current)
        try {
            await navigator.clipboard.writeText(email)
            setCopyState("copied")
        } catch {
            setCopyState("failed")
        }
        timer.current = setTimeout(() => setCopyState("idle"), 3000)
    }
    if (email)
        return (
            <div className="relative flex min-w-0 items-center rounded-md border border-input bg-card">
                <a className="min-w-0 flex-1 px-3 text-sm font-medium break-all" href={`mailto:${email}`}>
                    {email}
                </a>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    aria-label={t(copyState === "copied" ? "home.copied" : "home.copy")}
                >
                    {copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </Button>
                <span
                    role="status"
                    className={copyState === "failed" ? "absolute top-full mt-1 text-xs text-destructive" : "sr-only"}
                >
                    {copyState === "copied" ? t("home.copied") : copyState === "failed" ? t("home.copyFailed") : ""}
                </span>
            </div>
        )
    return (
        <Button variant="outline" onClick={() => setEmail(atob(encodedEmail))}>
            <Mail aria-hidden="true" />
            {t("home.revealEmail")}
        </Button>
    )
}

export const HomePage = () => {
    const { t, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const profileId = profile.id
    const [expandedBiography, setExpandedBiography] = useState<ProfileId | null>(null)
    const biographyExpanded = expandedBiography === profileId
    const hasBiographyDetails = Boolean(t(`home.biographies.${profileId}.details`))
    const showBlogButton = Boolean(profile.blog?.showOnHomepage)
    const actionCount = 2 + Number(showBlogButton) + Number(Boolean(profile.calendlyUrl))
    const isLocalProfile = isLocalProfileHostname(window.location.hostname)
    const configuredSite = getConfiguredSite()
    const resumePath = localizedPath(isLocalProfile ? `/${profileId}/resume` : "/resume")
    const blogPath = getProfileBlogPath(
        window.location.hostname,
        profileId,
        isProfileId(configuredSite) ? configuredSite : null
    )
    const profileBaseUrl = profile.canonicalUrl
    const canonicalUrl = `${profileBaseUrl}${routePrefix}/`
    const selectorPath = routePrefix ? `${routePrefix}/` : "/"
    const selectorHref =
        isLocalProfile && configuredSite === "local"
            ? localizedPath("/")
            : (getSelectorUrl(window.location.href, selectorPath) ?? `https://imbleau.com${selectorPath}`)
    const meta = (key: string) => t(`${profile.metaKey}.${key}`)

    const hrefForProfile = (nextProfile: ProfileId) => {
        const nextUrl = getProfileSwitchUrl(window.location.href, nextProfile)
        return nextUrl ?? localizedPath(`/${nextProfile}`)
    }

    return (
        <>
            <Helmet>
                <title>{meta("title")}</title>
                <meta name="description" content={meta("description")} />
                <meta name="title" content={meta("title")} />
                <meta property="og:description" content={meta("ogDescription")} />
                <meta property="og:locale" content={t("meta.ogLocale")} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${profileBaseUrl}/og-banner.png`} />
                <meta property="og:image:alt" content="Imbleau" />
                <meta name="twitter:description" content={meta("twitterDescription")} />
                <meta name="twitter:image" content={`${profileBaseUrl}/og-banner.png`} />
                <link rel="canonical" href={canonicalUrl} />
                <link rel="alternate" hrefLang="en-US" href={`${profileBaseUrl}/en/`} />
                <link rel="alternate" hrefLang="x-default" href={`${profileBaseUrl}/`} />
                <link rel="alternate" hrefLang="fr" href={`${profileBaseUrl}/fr/`} />
                <link rel="alternate" hrefLang="fa" href={`${profileBaseUrl}/fa/`} />
                <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        name: profile.fullName,
                        url: canonicalUrl,
                        jobTitle: meta("jobTitle"),
                        description: meta("personDescription"),
                        image: `${profileBaseUrl}/og-banner.png`,
                        ...(profile.nationality ? { nationality: profile.nationality } : {}),
                        sameAs: profile.socials.map(({ href }) => href),
                    })}
                </script>
            </Helmet>

            <article className="profile-page">
                <header className="profile-header">
                    <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground">
                        <a href={selectorHref} aria-label={t("home.backToSelector")} title={t("home.backToSelector")}>
                            <Undo2 aria-hidden="true" className="rtl:scale-x-[-1]" />
                        </a>
                    </Button>
                    <ProfileSwitcher
                        value={profileId}
                        label={t("profileSwitcher.label")}
                        hrefForProfile={hrefForProfile}
                    />
                    <p className="profile-role">{t(profile.roleKey)}</p>
                    <LanguageSwitcher />
                </header>
                <section className="profile-hero">
                    <div className="min-w-0">
                        <h1 className="hero-title">{t("home.headline")}</h1>
                        <p className="biography">
                            <Trans
                                t={t}
                                i18nKey={`home.biographies.${profileId}.introduction`}
                                components={{ uf: <a href="https://www.ufl.edu/" /> }}
                            />
                            {hasBiographyDetails && (
                                <span
                                    id="profile-biography-details"
                                    className={biographyExpanded ? "inline" : "hidden lg:inline"}
                                >
                                    {" "}
                                    <Trans
                                        t={t}
                                        i18nKey={`home.biographies.${profileId}.details`}
                                        components={{
                                            rust: (
                                                <AffiliationLink
                                                    href="https://rust-lang.org/governance/people/nuzzles/"
                                                    icon={<FontAwesomeIcon icon={faRust} className="size-full" />}
                                                />
                                            ),
                                            bevy: (
                                                <AffiliationLink
                                                    href="https://github.com/bevyengine/bevy"
                                                    icon={affiliationIcon("bevy")}
                                                />
                                            ),
                                            trunk: (
                                                <AffiliationLink
                                                    href="https://github.com/trunk-rs/trunk"
                                                    icon={affiliationIcon("wasm")}
                                                />
                                            ),
                                            linebender: (
                                                <AffiliationLink
                                                    href="https://linebender.org/"
                                                    icon={affiliationIcon("linebender")}
                                                />
                                            ),
                                            uf: <a href="https://www.ufl.edu/" />,
                                        }}
                                    />
                                </span>
                            )}
                            {hasBiographyDetails && (
                                <button
                                    className="text-link ms-1 rounded-sm lg:hidden"
                                    aria-expanded={biographyExpanded}
                                    aria-controls="profile-biography-details"
                                    onClick={() => setExpandedBiography(biographyExpanded ? null : profileId)}
                                >
                                    {t(biographyExpanded ? "home.readLess" : "home.readMore")}
                                </button>
                            )}
                        </p>
                    </div>
                    <figure className="portrait">
                        <img
                            alt={profile.fullName}
                            src={profile.image}
                            srcSet={profile.imageSrcSet}
                            sizes={PROFILE_HERO_IMAGE_SIZES}
                            fetchPriority="high"
                            loading="eager"
                        />
                        <figcaption>{t(profile.stickerKey)}</figcaption>
                    </figure>
                </section>
                <section className="action-section" aria-labelledby="start-here">
                    <h2 id="start-here">{t("home.startHere")}</h2>
                    <div className="profile-actions" style={{ "--action-count": actionCount } as CSSProperties}>
                        <Button asChild>
                            <a href={resumePath}>
                                <FileText aria-hidden="true" />
                                {t("home.resume")}
                            </a>
                        </Button>
                        <RevealEmailButton key={profileId} encodedEmail={profile.encodedEmail} />
                        {profile.calendlyUrl && (
                            <Button asChild variant="outline">
                                <a href={profile.calendlyUrl} target="_blank" rel="noopener noreferrer">
                                    <Calendar aria-hidden="true" />
                                    {t("home.scheduleOneOnOne")}
                                </a>
                            </Button>
                        )}
                        {showBlogButton && blogPath && (
                            <Button asChild variant="outline">
                                <a href={blogPath}>
                                    <Feather aria-hidden="true" />
                                    {t("home.blog")}
                                </a>
                            </Button>
                        )}
                    </div>
                </section>
                <footer className="profile-footer">
                    <div className="flex flex-wrap justify-center gap-1">
                        {profile.socials.map(({ kind, label, href }) => (
                            <Button key={label} asChild variant="ghost" size="sm">
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    {kind === "linkedin" ? (
                                        <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                                    ) : (
                                        <FontAwesomeIcon icon={faSquareGithub} aria-hidden="true" />
                                    )}
                                    {label}
                                </a>
                            </Button>
                        ))}
                    </div>
                    <p className="footer-credit">
                        {t("home.madeWith")} <Coffee aria-hidden="true" /> {t("home.andA")}{" "}
                        <Keyboard aria-hidden="true" />
                    </p>
                </footer>
            </article>
        </>
    )
}

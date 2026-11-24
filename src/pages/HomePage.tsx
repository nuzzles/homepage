import { ProfileFooter } from "@/components/ProfileFooter"
import { Trans } from "react-i18next"
import { LatestPosts } from "@/components/LatestPosts"
import { Helmet } from "react-helmet-async"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfilePortrait } from "@/components/ProfilePortrait"
import { ProfileActions } from "@/components/ProfileActions"
import { ProfileBiography } from "@/components/ProfileBiography"
import { ProjectsSection } from "@/components/ProjectsSection"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { usePageAnchor } from "@/hooks/usePageAnchor"
import { getProfileHomePath } from "@/profiles"

export const HomePage = () => {
    usePageAnchor()
    const { t, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const profileBaseUrl = profile.canonicalUrl
    const canonicalUrl = `${profileBaseUrl}${routePrefix}/`
    const base = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    const meta = (key: string) => t(`${profile.metaKey}.${key}`)
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

            <article className="profile-page portfolio-page">
                <ProfileHeader />
                <section className="profile-hero">
                    <div className="hero-copy min-w-0">
                        <h1 className="hero-title">
                            <span>
                                <Trans
                                    t={t}
                                    i18nKey="home.greeting"
                                    values={{ name: profile.firstName }}
                                    components={{ highlight: <span className="marker-underline" /> }}
                                />{" "}
                                <span className="greeting-wave" aria-hidden="true">
                                    👋
                                </span>
                            </span>
                        </h1>
                        <ProfileBiography />
                        {profile.about && (
                            <p className="about-link">
                                <Trans
                                    t={t}
                                    i18nKey="home.moreAbout"
                                    components={{ about: <a href={localizedPath(`${base}${profile.about.path}`)} /> }}
                                />
                            </p>
                        )}
                    </div>
                    <ProfilePortrait />
                </section>
                <ProfileActions />
                {profile.id === "spencer" && <LatestPosts />}
                <ProjectsSection />
                <ProfileFooter />
            </article>
        </>
    )
}

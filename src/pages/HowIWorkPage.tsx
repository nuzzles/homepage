import { MarkdownReadingLayout } from "@/components/MarkdownReadingLayout"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileFooter } from "@/components/ProfileFooter"
import { howIWorkContent } from "@/content/how-i-work"
import { usePageAnchor } from "@/hooks/usePageAnchor"
import { Helmet } from "react-helmet-async"
import { useLanguage } from "@/hooks/useLanguage"
import { languageConfig } from "@/i18n/i18n"
import { ProfileDocumentLink } from "@/components/ProfileDocumentLink"
import { useProfile } from "@/hooks/useProfile"

export const HowIWorkPage = () => {
    usePageAnchor()
    const { t, language, routePrefix } = useLanguage()
    const profile = useProfile()
    const page = profile.howIWork
    if (!page) return null

    const canonicalUrl = `${profile.canonicalUrl}${routePrefix}${page.path}`
    const title = `${t(page.titleKey)} | ${profile.fullName}`

    const content = howIWorkContent(language)

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={t(page.descriptionKey)} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={t(page.descriptionKey)} />
                <meta property="og:type" content="article" />
                <meta property="og:locale" content={t("meta.ogLocale")} />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={t(page.descriptionKey)} />
                <link rel="canonical" href={canonicalUrl} />
                {Object.values(languageConfig).map(({ urlPrefix, hreflang }) => (
                    <link
                        key={hreflang}
                        rel="alternate"
                        hrefLang={hreflang}
                        href={`${profile.canonicalUrl}${urlPrefix}${page.path}`}
                    />
                ))}
                <link rel="alternate" hrefLang="x-default" href={`${profile.canonicalUrl}${page.path}`} />
            </Helmet>
            <div className="profile-page portfolio-page how-i-work-page">
                <ProfileHeader />
                <header className="about-banner">
                    <h1 id="how-i-work-title">{t(page.titleKey)}</h1>
                    <ProfileDocumentLink current="howIWork" />
                </header>
                <MarkdownReadingLayout {...content} labelledBy="how-i-work-title" />
                <ProfileFooter />
            </div>
        </>
    )
}

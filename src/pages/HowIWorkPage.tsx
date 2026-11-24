import { ArrowLeft } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { useLanguage } from "@/hooks/useLanguage"
import { getDir, getHtmlLang, languageConfig } from "@/i18n/i18n"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ProfileDocumentNavigation } from "@/components/ProfileDocumentNavigation"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath } from "@/profiles"

export const HowIWorkPage = () => {
    const { t, language, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const page = profile.howIWork
    if (!page) return null

    const canonicalUrl = `${profile.canonicalUrl}${routePrefix}${page.path}`
    const title = `${t(page.titleKey)} | ${profile.fullName}`

    const principles = t("howIWorkPage.principles", { returnObjects: true }) as { title: string; body: string }[]

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
            <div className="document-page">
                <div className="document-toolbar">
                    <ProfileDocumentNavigation current="howIWork" />
                    <LanguageSwitcher />
                </div>
                <article
                    className="document-panel document-article"
                    aria-labelledby="how-i-work-title"
                    tabIndex={0}
                    lang={getHtmlLang(language)}
                    dir={getDir(language)}
                >
                    <p className="eyebrow">{t("howIWorkPage.label")}</p>
                    <h1 id="how-i-work-title">{t(page.titleKey)}</h1>
                    <p className="document-intro">{t("howIWorkPage.introduction")}</p>
                    {principles.map(({ title: principle, body }, index) => (
                        <section className="principle" key={principle}>
                            <span aria-hidden="true" className="eyebrow pt-1">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <h2>{principle}</h2>
                                <p>{body}</p>
                            </div>
                        </section>
                    ))}
                    <aside className="mt-6 rounded-lg border-s-4 border-primary bg-muted p-6">
                        <p className="eyebrow mb-2">{t("howIWorkPage.testLabel")}</p>
                        <p className="text-lg leading-relaxed font-medium">{t("howIWorkPage.reflection")}</p>
                    </aside>
                </article>
                <div className="document-actions">
                    <Button asChild variant="ghost" size="sm">
                        <a href={localizedPath(getProfileHomePath(window.location.hostname, profile.id))}>
                            <ArrowLeft aria-hidden="true" className="rtl:rotate-180" />
                            {t("resumePage.goBack")}
                        </a>
                    </Button>
                </div>
            </div>
        </>
    )
}

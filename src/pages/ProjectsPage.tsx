import { Helmet } from "react-helmet-async"
import { Link, useParams } from "react-router-dom"
import { Trans } from "react-i18next"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileFooter } from "@/components/ProfileFooter"
import { ProjectGrid } from "@/components/ProjectGrid"
import { FeaturedProjectImage, FeaturedProjectLabel } from "@/components/FeaturedProject"
import { MarkdownReadingLayout } from "@/components/MarkdownReadingLayout"
import { Button } from "@/components/ui/button"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { projectContent } from "@/content/projects"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { useProfileNavigation } from "@/hooks/useProfileNavigation"
import { usePageAnchor } from "@/hooks/usePageAnchor"
import { languageConfig } from "@/i18n/i18n"
import "./projects.css"

export const ProjectsPage = () => {
    usePageAnchor()
    const { t, language, routePrefix } = useLanguage()
    const profile = useProfile()
    const navigation = useProfileNavigation()
    const { projectSlug } = useParams()
    const page = profile.projectsPage
    const project = projectSlug ? profile.projects?.find((item) => item.feature?.slug === projectSlug) : undefined
    const feature = project?.feature
    if (!page || !navigation.projects || (projectSlug && !feature)) return <NotFoundPage />
    const path = `${page.path}${feature ? `/${feature.slug}` : ""}`
    const canonicalUrl = `${profile.canonicalUrl}${routePrefix}${path}`
    const title = `${project?.name ?? t(page.titleKey)} | ${profile.fullName}`
    const description = t(project?.descriptionKey ?? page.descriptionKey)
    const { htmlLang, dir } = languageConfig[language]
    const otherProjects = profile.projects?.filter((item) => !item.feature)
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content={t("meta.ogLocale")} />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                {Object.values(languageConfig).map(({ urlPrefix, hreflang }) => (
                    <link
                        key={hreflang}
                        rel="alternate"
                        hrefLang={hreflang}
                        href={`${profile.canonicalUrl}${urlPrefix}${path}`}
                    />
                ))}
                <link rel="alternate" hrefLang="x-default" href={`${profile.canonicalUrl}${path}`} />
            </Helmet>
            <div className="profile-page portfolio-page projects-page" lang={htmlLang} dir={dir}>
                <ProfileHeader />
                {project && feature ? (
                    <>
                        <div className="project-story-header">
                            <Button asChild variant="link" className="project-back-link">
                                <Link to={navigation.projects}>
                                    <ArrowLeft aria-hidden="true" className="rtl:rotate-180" />
                                    {t("projectsPage.back")}
                                </Link>
                            </Button>
                            <header className="portfolio-intro">
                                <FeaturedProjectLabel feature={feature} />
                                <h1 id="project-title">
                                    <bdi>{project.name}</bdi>
                                </h1>
                                <p className="portfolio-deck">{description}</p>
                            </header>
                            <FeaturedProjectImage feature={feature} eager />
                        </div>
                        <MarkdownReadingLayout
                            {...projectContent(feature.slug, language)}
                            labelledBy="project-title"
                            components={{
                                a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                        {children}
                                        <span className="sr-only"> ({t("navigation.newTab")})</span>
                                    </a>
                                ),
                            }}
                        />
                        <div className="project-story-links">
                            <Button asChild variant="outline">
                                <a href={project.href} target="_blank" rel="noopener noreferrer">
                                    {t("projectsPage.visit")}
                                    <ExternalLink aria-hidden="true" />
                                    <span className="sr-only">{t("navigation.newTab")}</span>
                                </a>
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="projects-gallery">
                        <header className="portfolio-intro">
                            <p className="portfolio-eyebrow">
                                <span>{profile.fullName}</span>
                                <span>{t(page.titleKey)}</span>
                            </p>
                            <h1>
                                <Trans t={t} i18nKey="projectsPage.heading" components={{ em: <em /> }} />
                            </h1>
                            <p className="portfolio-deck">{description}</p>
                        </header>
                        <div className="editorial-spreads">
                            {profile.projects?.map(
                                (item) =>
                                    item.feature && (
                                        <Link
                                            className="editorial-spread"
                                            key={item.id}
                                            to={`${navigation.projects}/${item.feature.slug}`}
                                            aria-labelledby={`project-${item.id}`}
                                        >
                                            <div className="work-heading">
                                                <FeaturedProjectLabel feature={item.feature} />
                                                <h2 id={`project-${item.id}`}>
                                                    <bdi>{item.name}</bdi>
                                                    <span className="sr-only"> — {t("projectsPage.featured")}</span>
                                                </h2>
                                                <p className="portfolio-deck">{t(item.descriptionKey)}</p>
                                            </div>
                                            <FeaturedProjectImage feature={item.feature} />
                                        </Link>
                                    )
                            )}
                        </div>
                        {!!otherProjects?.length && (
                            <section className="other-projects" aria-labelledby="other-projects-title">
                                <h2 id="other-projects-title">{t("projectsPage.other")}</h2>
                                <ProjectGrid projects={otherProjects} />
                            </section>
                        )}
                    </div>
                )}
                <ProfileFooter />
            </div>
        </>
    )
}

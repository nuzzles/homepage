import { AboutContents } from "@/components/AboutContents"
import { ProfileFooter } from "@/components/ProfileFooter"
import { Helmet } from "react-helmet-async"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Link } from "react-router-dom"
import { aboutSections } from "@/content/about"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileActions } from "@/components/ProfileActions"
import { ProfileBiography } from "@/components/ProfileBiography"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { usePageAnchor } from "@/hooks/usePageAnchor"
import { getConfiguredSite } from "@/site"
import { languageConfig } from "@/i18n/i18n"
import { getProfileHomePath, getSpencerBlogPath, isProfileId } from "@/profiles"

export const AboutPage = () => {
    usePageAnchor()
    const { t, language, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const page = profile.about
    if (!page) return null
    const title = `${t(page.titleKey)} | ${profile.fullName}`
    const canonical = `${profile.canonicalUrl}${routePrefix}${page.path}`
    const home = localizedPath(getProfileHomePath(window.location.hostname, profile.id))
    const site = getConfiguredSite()
    const blog = getSpencerBlogPath(window.location.hostname, isProfileId(site) ? site : null)
    const sections = aboutSections(language)
    return (
        <div className="profile-page portfolio-page about-page">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={t(page.descriptionKey)} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={t(page.descriptionKey)} />
                <meta property="og:url" content={canonical} />
                <meta property="og:locale" content={t("meta.ogLocale")} />
                <link rel="canonical" href={canonical} />
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
            <ProfileHeader current="about" />
            <header className="about-banner">
                <h1>{t(page.titleKey)}</h1>
            </header>
            <div className="about-layout">
                <AboutContents sections={sections} />
                <article className="about-prose">
                    {sections.map(({ id, title, body }) => (
                        <section id={id} key={id}>
                            <h2>{title}</h2>
                            <Markdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => {
                                        if (children === "::biography") return <ProfileBiography />
                                        if (children === "::contact") return <ProfileActions />
                                        if (children === "::projects")
                                            return (
                                                <ul className="about-project-list">
                                                    {profile.projects?.map((project) => (
                                                        <li key={project.id}>
                                                            <a
                                                                href={project.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {project.name}
                                                            </a>
                                                            <p>{t(project.descriptionKey)}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )
                                        if (children === "::identity")
                                            return (
                                                <table className="identity-table">
                                                    <caption className="sr-only">
                                                        {t("aboutPage.identity.title")}
                                                    </caption>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">{t("aboutPage.identity.platform")}</th>
                                                            <th scope="col">{t("aboutPage.identity.account")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {profile.socials.map(({ kind, label, href }) => (
                                                            <tr key={kind}>
                                                                <th scope="row">{label}</th>
                                                                <td>
                                                                    <a
                                                                        href={href}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        dir="ltr"
                                                                    >
                                                                        {kind === "github"
                                                                            ? `@${new URL(href).pathname.split("/").filter(Boolean).at(-1)}`
                                                                            : new URL(href).pathname.replace(/\/$/, "")}
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )
                                        return <p>{children}</p>
                                    },
                                    a: ({ href, children }) => {
                                        if (href === "projects") return <Link to={`${home}#projects`}>{children}</Link>
                                        if (href === "blog" || href === "categories")
                                            return (
                                                <a
                                                    href={`${blog ?? "/blog/"}${href === "categories" ? "categories.html" : ""}`}
                                                >
                                                    {children}
                                                </a>
                                            )
                                        return (
                                            <a href={href} target="_blank" rel="noopener noreferrer">
                                                {children}
                                            </a>
                                        )
                                    },
                                }}
                            >
                                {body}
                            </Markdown>
                        </section>
                    ))}
                </article>
            </div>
            <ProfileFooter />
        </div>
    )
}

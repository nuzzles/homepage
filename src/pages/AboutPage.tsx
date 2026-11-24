import { Helmet } from "react-helmet-async"
import { Trans } from "react-i18next"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileActions } from "@/components/ProfileActions"
import { ProfileBiography } from "@/components/ProfileBiography"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { usePageAnchor } from "@/hooks/usePageAnchor"
import { getConfiguredSite } from "@/site"
import { languageConfig } from "@/i18n/i18n"
import { getProfileHomePath, getProfileBlogPath, isProfileId } from "@/profiles"

export const AboutPage = () => {
    usePageAnchor()
    const { t, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const page = profile.about
    if (!page) return null
    const title = `${t(page.titleKey)} | ${profile.fullName}`
    const canonical = `${profile.canonicalUrl}${routePrefix}${page.path}`
    const home = localizedPath(getProfileHomePath(window.location.hostname, profile.id))
    const site = getConfiguredSite()
    const blog = getProfileBlogPath(window.location.hostname, profile.id, isProfileId(site) ? site : null)
    const sections = ["background", "openSource", "projects", "blog", "contact"] as const
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
                <aside className="about-contents">
                    <nav aria-label={t("aboutPage.contents")}>
                        <p>{t("aboutPage.contents")}</p>
                        {sections.map((id) => (
                            <a key={id} href={`#${id}`}>
                                {t(`aboutPage.${id}.title`)}
                            </a>
                        ))}
                    </nav>
                </aside>
                <article className="about-prose">
                    <section id="background">
                        <h2>{t("aboutPage.background.title")}</h2>
                        <ProfileBiography />
                        <p>{t("aboutPage.background.body")}</p>
                    </section>
                    <section id="openSource">
                        <h2>{t("aboutPage.openSource.title")}</h2>
                        <p>
                            <Trans
                                t={t}
                                i18nKey="aboutPage.openSource.graphics"
                                components={{
                                    bevyVello: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/linebender/bevy_vello"
                                        />
                                    ),
                                    velloSvg: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/linebender/vello_svg"
                                        />
                                    ),
                                    velato: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/linebender/velato"
                                        />
                                    ),
                                }}
                            />
                        </p>
                        <p>
                            <Trans
                                t={t}
                                i18nKey="aboutPage.openSource.tools"
                                components={{
                                    trunk: <a target="_blank" rel="noopener noreferrer" href="https://trunkrs.dev" />,
                                    bevy: <a target="_blank" rel="noopener noreferrer" href="https://bevy.org" />,
                                    rust: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://rust-lang.org/governance/people/nuzzles/"
                                        />
                                    ),
                                }}
                            />
                        </p>
                    </section>
                    <section id="projects">
                        <h2>{t("aboutPage.projects.title")}</h2>
                        <p>{t("aboutPage.projects.body")}</p>
                        <ul className="about-project-list">
                            {profile.projects?.map((project) => (
                                <li key={project.id}>
                                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                                        {project.name}
                                    </a>
                                    <p>{t(project.descriptionKey)}</p>
                                </li>
                            ))}
                        </ul>
                        <a className="text-link" href={`${home}#projects`}>
                            {t("aboutPage.projects.all")}
                        </a>
                    </section>
                    <section id="blog">
                        <h2>{t("aboutPage.blog.title")}</h2>
                        <p>
                            <Trans
                                t={t}
                                i18nKey="aboutPage.blog.opinions"
                                components={{ blog: <a href={blog ?? "/blog/"} /> }}
                            />
                        </p>
                        <p>
                            <Trans
                                t={t}
                                i18nKey="aboutPage.blog.source"
                                components={{
                                    repository: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/nuzzles/homepage"
                                        />
                                    ),
                                    issues: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/nuzzles/homepage/issues"
                                        />
                                    ),
                                }}
                            />
                        </p>
                        <p>
                            <Trans
                                t={t}
                                i18nKey="aboutPage.blog.categories"
                                components={{ categories: <a href={`${blog ?? "/blog/"}categories.html`} /> }}
                            />
                        </p>
                        <p>
                            <Trans
                                t={t}
                                i18nKey="aboutPage.blog.license"
                                components={{
                                    cc: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://creativecommons.org/licenses/by/4.0/"
                                        />
                                    ),
                                    apache: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.apache.org/licenses/LICENSE-2.0"
                                        />
                                    ),
                                }}
                            />
                        </p>
                    </section>
                    <section id="contact">
                        <h2>{t("aboutPage.contact.title")}</h2>
                        <p>{t("aboutPage.contact.body")}</p>
                        <ProfileActions />
                    </section>
                </article>
            </div>
            <footer className="profile-footer">
                <span className="footer-name">{profile.fullName}</span>
                <a className="text-link" href={home}>
                    {t("navigation.home")}
                </a>
            </footer>
        </div>
    )
}

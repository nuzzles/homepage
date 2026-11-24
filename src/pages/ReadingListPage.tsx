import { Trans } from "react-i18next"
import { Helmet } from "react-helmet-async"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileFooter } from "@/components/ProfileFooter"
import { ContentHeading } from "@/components/ContentHeading"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { usePageAnchor } from "@/hooks/usePageAnchor"
import { languageConfig } from "@/i18n/i18n"
import { readingList } from "@/content/reading-list"

export const ReadingListPage = () => {
    usePageAnchor()
    const { t, language, routePrefix } = useLanguage()
    const profile = useProfile()
    const page = profile.readingList
    if (!page) return null
    const canonicalUrl = `${profile.canonicalUrl}${routePrefix}${page.path}`
    const title = `${t(page.titleKey)} | ${profile.fullName}`
    const { htmlLang, dir } = languageConfig[language]
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={t(page.descriptionKey)} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={t(page.descriptionKey)} />
                <meta property="og:type" content="website" />
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
            <div className="profile-page portfolio-page reading-list-page">
                <ProfileHeader />
                <header className="about-banner">
                    <h1>{t(page.titleKey)}</h1>
                </header>
                <div className="reading-list-content" lang={htmlLang} dir={dir}>
                    <div className="reading-list-introduction">
                        <p>{t("readingListPage.introduction")}</p>
                        <p>
                            <Trans
                                t={t}
                                i18nKey="readingListPage.bookshop"
                                components={{
                                    bookshop: (
                                        <a href="https://bookshop.org/" target="_blank" rel="noopener noreferrer" />
                                    ),
                                }}
                            />
                        </p>
                    </div>
                    {readingList.map(({ year, books }) => (
                        <section className="reading-list-year" key={year} aria-labelledby={`year-${year}`}>
                            <header>
                                <ContentHeading id={`year-${year}`}>{year}</ContentHeading>
                                <p>{t("readingListPage.bookCount", { count: books.length })}</p>
                            </header>
                            <ul className="reading-list-books">
                                {books.map((book) => (
                                    <li key={book.title} lang="en" dir="ltr">
                                        <img
                                            className="book-cover"
                                            src={book.cover}
                                            width="120"
                                            height="180"
                                            alt=""
                                            loading="lazy"
                                        />
                                        <div>
                                            <h3>{book.title}</h3>
                                            <p>{book.author}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
                <ProfileFooter />
            </div>
        </>
    )
}

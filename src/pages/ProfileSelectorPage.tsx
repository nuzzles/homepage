import { ArrowRight } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Card } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/hooks/useLanguage"
import {
    getCanonicalProfileUrl,
    getProfileSwitchUrl,
    isLocalProfileHostname,
    PROFILE_CARD_IMAGE_SIZES,
    PROFILE_ENTRIES,
    type ProfileId,
} from "@/profiles"

export const ProfileSelectorPage = () => {
    const { t, language, routePrefix, localizedPath } = useLanguage()
    const canonicalUrl = `https://imbleau.com${routePrefix}/`
    const profileNames = new Intl.ListFormat(language, { style: "long", type: "conjunction" }).format(
        PROFILE_ENTRIES.map(({ firstName }) => firstName)
    )
    const meta = (key: string) => t(`profileSelector.${key}`, { profiles: profileNames })

    const hrefForProfile = (profile: ProfileId) => {
        const nextUrl = getProfileSwitchUrl(window.location.href, profile)
        if (nextUrl) return nextUrl

        if (isLocalProfileHostname(window.location.hostname)) {
            return localizedPath(`/${profile}`)
        }

        return getCanonicalProfileUrl(profile)
    }

    return (
        <>
            <Helmet>
                <title>{meta("metaTitle")}</title>
                <meta name="description" content={meta("metaDescription")} />
                <meta name="title" content={meta("metaTitle")} />
                <meta property="og:title" content={meta("metaTitle")} />
                <meta property="og:description" content={meta("metaDescription")} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content="https://imbleau.com/og-banner.png" />
                <meta property="og:image:alt" content="Imbleau" />
                <meta name="twitter:title" content={meta("metaTitle")} />
                <meta name="twitter:description" content={meta("metaDescription")} />
                <meta name="twitter:image" content="https://imbleau.com/og-banner.png" />
                <link rel="canonical" href={canonicalUrl} />
                <link rel="alternate" hrefLang="en-US" href="https://imbleau.com/en/" />
                <link rel="alternate" hrefLang="x-default" href="https://imbleau.com/" />
                <link rel="alternate" hrefLang="fr" href="https://imbleau.com/fr/" />
                <link rel="alternate" hrefLang="fa" href="https://imbleau.com/fa/" />
                <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
            </Helmet>
            <article className="w-full max-w-3xl">
                <header className="profile-header justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">{t("profileSelector.headerLabel")}</h1>
                    <LanguageSwitcher />
                </header>
                <div className="grid grid-cols-2 gap-4 py-8 sm:gap-6 sm:py-12">
                    {PROFILE_ENTRIES.map(({ id, firstName, fullName, image, imageSrcSet, roleKey }) => (
                        <Card key={id} className="overflow-hidden shadow-none transition-shadow hover:shadow-md">
                            <a
                                className="profile-choice group block rounded-xl"
                                href={hrefForProfile(id)}
                                aria-label={fullName}
                            >
                                <img
                                    className="aspect-square w-full object-cover"
                                    src={image}
                                    srcSet={imageSrcSet}
                                    sizes={PROFILE_CARD_IMAGE_SIZES}
                                    fetchPriority="high"
                                    loading="eager"
                                    alt=""
                                />
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="text-xl font-semibold group-hover:text-primary sm:text-2xl">
                                            {firstName}
                                        </h2>
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="size-5 shrink-0 text-primary rtl:rotate-180"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(roleKey)}</p>
                                </div>
                            </a>
                        </Card>
                    ))}
                </div>
            </article>
        </>
    )
}

import { Box, ButtonBase, Typography } from "@mui/material"
import ArrowForward from "@mui/icons-material/ArrowForward"
import { Helmet } from "react-helmet-async"
import { CornerFrame } from "@/components/CornerFrame"
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
    const { t, language, prefix, localizedPath } = useLanguage()
    const canonicalUrl = `https://imbleau.com${prefix}/`
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
            <Box component="article" sx={{ width: "100%", maxWidth: 760, mx: "auto", px: { xs: 1, sm: 2.5 } }}>
                <Box
                    component="header"
                    sx={(theme) => ({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        pb: 1,
                        borderBottom: `1px solid ${theme.palette.text.primary}`,
                    })}
                >
                    <Typography
                        component="span"
                        sx={{
                            fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
                            fontSize: { xs: "1.75rem", sm: "2.25rem" },
                            fontWeight: 900,
                            lineHeight: 0.9,
                            textTransform: "uppercase",
                        }}
                    >
                        {t("profileSelector.headerLabel")}
                    </Typography>
                    <LanguageSwitcher />
                </Box>

                <Box component="section" aria-label="Profiles" sx={{ py: { xs: 4, sm: 6 } }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: { xs: 1, sm: 2.5 },
                        }}
                    >
                        {PROFILE_ENTRIES.map(({ id, firstName, fullName, image, imageSrcSet }) => (
                            <Box key={id} sx={{ position: "relative", minWidth: 0 }}>
                                <Box
                                    aria-hidden="true"
                                    sx={(theme) => ({
                                        position: "absolute",
                                        inset: { xs: "12px -4px -4px 12px", sm: "16px -8px -8px 16px" },
                                        backgroundColor: theme.palette.primary.main,
                                    })}
                                />
                                <CornerFrame>
                                    <ButtonBase
                                        component="a"
                                        href={hrefForProfile(id)}
                                        aria-label={fullName}
                                        sx={(theme) => ({
                                            display: "block",
                                            width: "100%",
                                            color: theme.palette.text.primary,
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.text.primary}`,
                                            textAlign: "start",
                                            "&:focus-visible": {
                                                outline: `2px solid ${theme.palette.primary.main}`,
                                                outlineOffset: 3,
                                            },
                                            "&:hover .profile-photo": {
                                                transform: "scale(1.02)",
                                            },
                                            "&:hover .profile-name": {
                                                color: theme.palette.primary.main,
                                            },
                                        })}
                                    >
                                        <Box sx={{ overflow: "hidden" }}>
                                            <Box
                                                className="profile-photo"
                                                component="img"
                                                src={image}
                                                srcSet={imageSrcSet}
                                                sizes={PROFILE_CARD_IMAGE_SIZES}
                                                fetchPriority="high"
                                                loading="eager"
                                                alt={fullName}
                                                sx={{
                                                    display: "block",
                                                    width: "100%",
                                                    aspectRatio: "1 / 1",
                                                    objectFit: "cover",
                                                    transition: "transform 180ms ease-out",
                                                }}
                                            />
                                        </Box>
                                        <Box
                                            component="span"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 1,
                                                px: { xs: 1.25, sm: 2 },
                                                py: { xs: 1, sm: 1.5 },
                                            }}
                                        >
                                            <Box
                                                className="profile-name"
                                                component="span"
                                                sx={{
                                                    minWidth: 0,
                                                    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
                                                    fontSize: { xs: "1.6rem", sm: "2.25rem" },
                                                    fontWeight: 800,
                                                    lineHeight: 1,
                                                    textTransform: "uppercase",
                                                    transition: "color 120ms ease-out",
                                                }}
                                            >
                                                {firstName}
                                            </Box>
                                            <ArrowForward
                                                sx={{
                                                    flexShrink: 0,
                                                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                                                    "[dir='rtl'] &": { transform: "rotate(180deg)" },
                                                }}
                                            />
                                        </Box>
                                    </ButtonBase>
                                </CornerFrame>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </>
    )
}

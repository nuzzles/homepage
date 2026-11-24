import { Box, Typography } from "@mui/material"
import ArrowBack from "@mui/icons-material/ArrowBack"
import { Helmet } from "react-helmet-async"
import { useLanguage } from "@/hooks/useLanguage"
import { getDir, getHtmlLang, languageConfig } from "@/i18n/i18n"
import { CornerFrame } from "@/components/CornerFrame"
import { LightButton } from "@/components/LightButton"
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
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ProfileDocumentNavigation current="howIWork" />
                <CornerFrame>
                    <Box
                        component="article"
                        aria-labelledby="how-i-work-title"
                        tabIndex={0}
                        lang={getHtmlLang(language)}
                        dir={getDir(language)}
                        sx={(theme) => ({
                            aspectRatio: "8.5 / 11",
                            height: "calc(100dvh - 164px)",
                            maxHeight: "11in",
                            maxWidth: "min(calc(100vw - 48px), 8.5in)",
                            width: "100%",
                            backgroundColor: theme.palette.background.elevated,
                            border: `1px solid ${theme.palette.border.light}`,
                            overflowY: "auto",
                            overflowWrap: "anywhere",
                            px: { xs: 2, sm: 5 },
                            py: { xs: 3, sm: 5 },
                            "&:focus-visible": {
                                outline: `2px solid ${theme.palette.primary.main}`,
                                outlineOffset: 2,
                            },
                        })}
                    >
                        <Typography
                            sx={{
                                color: "primary.main",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontSize: "0.8rem",
                            }}
                        >
                            {t("howIWorkPage.label")}
                        </Typography>
                        <Typography
                            component="h1"
                            id="how-i-work-title"
                            variant="h1"
                            sx={{
                                my: 1.5,
                                fontSize: { xs: "2.5rem", sm: "5rem" },
                                lineHeight: 1,
                                textTransform: "uppercase",
                            }}
                        >
                            {t(page.titleKey)}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" }, lineHeight: 1.65, mb: 4 }}>
                            {t("howIWorkPage.introduction")}
                        </Typography>
                        {principles.map(({ title: principle, body }, index) => (
                            <Box
                                component="section"
                                key={principle}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "24px 1fr", sm: "36px 1fr" },
                                    gap: { xs: 1.5, sm: 2 },
                                    py: 2.5,
                                    borderTop: 1,
                                    borderColor: "border.light",
                                }}
                            >
                                <Typography
                                    aria-hidden="true"
                                    sx={{ color: "primary.main", fontWeight: 700, pt: 0.4, fontSize: "0.8rem" }}
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </Typography>
                                <Box>
                                    <Typography
                                        component="h2"
                                        variant="h3"
                                        sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem" }, lineHeight: 1.15, mb: 1 }}
                                    >
                                        {principle}
                                    </Typography>
                                    <Typography sx={{ lineHeight: 1.7 }}>{body}</Typography>
                                </Box>
                            </Box>
                        ))}
                        <Box
                            sx={{
                                mt: 3,
                                p: { xs: 2, sm: 3 },
                                borderInlineStart: "4px solid",
                                borderColor: "primary.main",
                                backgroundColor: "background.paper",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "primary.main",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    mb: 1,
                                }}
                            >
                                {t("howIWorkPage.testLabel")}
                            </Typography>
                            <Typography sx={{ fontSize: "1.2rem", lineHeight: 1.5, fontWeight: 600 }}>
                                {t("howIWorkPage.reflection")}
                            </Typography>
                        </Box>
                    </Box>
                </CornerFrame>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <LightButton
                        href={localizedPath(getProfileHomePath(window.location.hostname, profile.id))}
                        variant="tertiary"
                        size="small"
                        sx={{ px: 1.5 }}
                    >
                        <ArrowBack
                            sx={{
                                fontSize: "1rem",
                                marginInlineEnd: 0.5,
                                transform: language === "fa" ? "scaleX(-1)" : undefined,
                            }}
                        />
                        {t("resumePage.goBack")}
                    </LightButton>
                </Box>
            </Box>
        </>
    )
}

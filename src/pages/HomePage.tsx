import { useState } from "react"
import { Box, Container, IconButton, Link as MuiLink, Tooltip, Typography } from "@mui/material"
import {
    Article,
    CalendarMonth,
    Check,
    Coffee,
    ContentCopy,
    Description,
    Email,
    Keyboard,
    LinkedIn,
    OpenInNew,
} from "@mui/icons-material"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquareGithub, faSquareHackerNews } from "@fortawesome/free-brands-svg-icons"
import { LightButton } from "@/components/LightButton"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/hooks/useLanguage"

const CALENDLY_URL = "https://calendly.com/simbleau/meet"

// Obfuscated email — never appears in plaintext in source
const OBF = "c3BlbmNlckBpbWJsZWF1LmNvbQ=="

const socials = [
    { label: "in/simbleau", href: "https://www.linkedin.com/in/simbleau/", icon: <LinkedIn sx={{ fontSize: "1rem" }} /> },
    {
        label: "@nuzzles",
        href: "https://www.github.com/nuzzles/",
        icon: <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "1rem" }} />,
    },
    {
        label: "simbleau",
        href: "https://news.ycombinator.com/user?id=simbleau",
        icon: <FontAwesomeIcon icon={faSquareHackerNews} style={{ fontSize: "1rem" }} />,
    },
    {
        label: "blog",
        href: "https://nuzzles.github.io/",
        icon: <Article sx={{ fontSize: "1rem" }} />,
    },
] as const

const RevealEmailButton = () => {
    const { t } = useTranslation()
    const [email, setEmail] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleReveal = () => {
        setEmail(atob(OBF))
    }

    const handleCopy = () => {
        if (email) {
            navigator.clipboard.writeText(email)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (email) {
        return (
            <Box
                sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${theme.palette.border.main}`,
                    backgroundColor: theme.palette.background.paper,
                    height: 50,
                    width: "100%",
                })}
            >
                <MuiLink
                    href={`mailto:${email}`}
                    underline="hover"
                    sx={{
                        flex: 1,
                        px: 1.5,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                    }}
                >
                    {email}
                </MuiLink>
                <Tooltip title={copied ? t("home.copied") : t("home.copy")}>
                    <IconButton onClick={handleCopy} size="small" sx={{ marginInlineEnd: 0.5 }}>
                        {copied ? <Check sx={{ fontSize: "1.1rem" }} /> : <ContentCopy sx={{ fontSize: "1.1rem" }} />}
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }

    return (
        <LightButton variant="secondary" fullWidth onClick={handleReveal}>
            <Email sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
            {t("home.revealEmail")}
        </LightButton>
    )
}

const W = { xs: 280, md: 360 }

const BASE_URL = "https://spencer.imbleau.com"

export const HomePage = () => {
    const { t, prefix, localizedPath } = useLanguage()
    const canonicalUrl = `${BASE_URL}${prefix}/`

    return (
        <>
            <Helmet>
                <title>{t("meta.title")}</title>
                <meta name="description" content={t("meta.description")} />
                <meta name="title" content={t("meta.title")} />
                <meta property="og:description" content={t("meta.ogDescription")} />
                <meta property="og:locale" content={t("meta.ogLocale")} />
                <meta property="og:image:alt" content={t("meta.ogImageAlt")} />
                <meta name="twitter:description" content={t("meta.twitterDescription")} />
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        name: "Spencer Imbleau",
                        url: BASE_URL,
                        jobTitle: t("meta.jobTitle"),
                        description: t("meta.personDescription"),
                        image: `${BASE_URL}/og-banner.png`,
                        nationality: "American",
                        sameAs: [
                            "https://www.linkedin.com/in/simbleau/",
                            "https://github.com/nuzzles/",
                            "https://mastodon.online/@scim",
                            "https://nuzzles.github.io/",
                        ],
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: "Spencer Imbleau",
                        url: BASE_URL,
                        description: t("meta.websiteDescription"),
                        author: {
                            "@type": "Person",
                            name: "Spencer Imbleau",
                        },
                    })}
                </script>
            </Helmet>
            <Container
                maxWidth="sm"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Box
                    sx={(theme) => {
                        const corner = 20
                        const gap = 6
                        const borderW = 2
                        const c = theme.palette.divider
                        return {
                            position: "relative",
                            padding: `${gap + borderW}px`,
                            "&::before, &::after, & > .corner-bl, & > .corner-br": {
                                content: '""',
                                position: "absolute",
                                width: corner,
                                height: corner,
                                pointerEvents: "none",
                            },
                            "&::before": {
                                top: 0,
                                left: 0,
                                borderTop: `${borderW}px solid ${c}`,
                                borderLeft: `${borderW}px solid ${c}`,
                            },
                            "&::after": {
                                top: 0,
                                right: 0,
                                borderTop: `${borderW}px solid ${c}`,
                                borderRight: `${borderW}px solid ${c}`,
                            },
                        }
                    }}
                >
                    <Box
                        className="corner-bl"
                        sx={(theme) => ({
                            bottom: 0,
                            left: 0,
                            borderBottom: `2px solid ${theme.palette.divider}`,
                            borderLeft: `2px solid ${theme.palette.divider}`,
                        })}
                    />
                    <Box
                        className="corner-br"
                        sx={(theme) => ({
                            bottom: 0,
                            right: 0,
                            borderBottom: `2px solid ${theme.palette.divider}`,
                            borderRight: `2px solid ${theme.palette.divider}`,
                        })}
                    />
                    <Box
                        component="img"
                        alt="Spencer Imbleau"
                        src="/images/me.webp"
                        sx={{
                            display: "block",
                            width: W,
                            height: W,
                            objectFit: "cover",
                        }}
                    />
                </Box>

                <Typography
                    variant="h5"
                    component="h1"
                    sx={{ mt: 1, fontWeight: 700, width: W, textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                    Spencer Imbleau
                </Typography>

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5, width: W }}>
                    <Link to={localizedPath("/resume")} style={{ textDecoration: "none" }}>
                        <LightButton variant="primary" fullWidth>
                            <Description sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                            {t("home.resume")}
                        </LightButton>
                    </Link>
                    <RevealEmailButton />
                    <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <LightButton variant="secondary" fullWidth>
                            <CalendarMonth sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                            {t("home.scheduleOneOnOne")}
                            <OpenInNew sx={{ fontSize: "1rem", marginInlineStart: 0.5 }} />
                        </LightButton>
                    </a>
                </Box>

                <Box sx={{ mt: 2, width: W, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    {socials.map(({ label, href, icon }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            <LightButton
                                variant="tertiary"
                                size="small"
                                fullWidth
                                sx={{ px: 1, letterSpacing: "0.05em", fontSize: "0.75rem" }}
                            >
                                {icon}
                                {label}
                                <OpenInNew sx={{ fontSize: "0.65rem", marginInlineStart: 0.25 }} />
                            </LightButton>
                        </a>
                    ))}
                </Box>

                <Box sx={{ mt: 2 }}>
                    <LanguageSwitcher />
                </Box>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    {t("home.madeWith")} <Coffee sx={{ fontSize: "0.9rem", verticalAlign: "middle" }} />{" "}
                    {t("home.andA")} <Keyboard sx={{ fontSize: "1rem", verticalAlign: "middle" }} />
                </Typography>
            </Container>
        </>
    )
}

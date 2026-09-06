import { useState } from "react"
import { Box, IconButton, Link as MuiLink, Tooltip, Typography } from "@mui/material"
import CalendarMonth from "@mui/icons-material/CalendarMonth"
import Check from "@mui/icons-material/Check"
import Coffee from "@mui/icons-material/Coffee"
import ContentCopy from "@mui/icons-material/ContentCopy"
import Description from "@mui/icons-material/Description"
import Email from "@mui/icons-material/Email"
import Keyboard from "@mui/icons-material/Keyboard"
import LinkedIn from "@mui/icons-material/LinkedIn"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquareGithub } from "@fortawesome/free-brands-svg-icons"
import { CornerFrame } from "@/components/CornerFrame"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { LightButton } from "@/components/LightButton"
import { ProfileSwitcher } from "@/components/ProfileSwitcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { getProfileSwitchUrl, isLocalProfileHostname, PROFILE_HERO_IMAGE_SIZES, type ProfileId } from "@/profiles"

const RevealEmailButton = ({ encodedEmail }: { encodedEmail: string }) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!email) return
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    if (email) {
        return (
            <Box
                sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    minHeight: 52,
                    width: "100%",
                    border: `1px solid ${theme.palette.text.primary}`,
                    backgroundColor: theme.palette.background.paper,
                })}
            >
                <MuiLink
                    href={`mailto:${email}`}
                    underline="hover"
                    sx={{
                        flex: 1,
                        px: 1.5,
                        fontSize: "0.95rem",
                        fontWeight: 700,
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
        <LightButton variant="secondary" fullWidth onClick={() => setEmail(atob(encodedEmail))}>
            <Email sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
            {t("home.revealEmail")}
        </LightButton>
    )
}

export const HomePage = () => {
    const { t, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const profileId = profile.id
    const actionCount = 2 + Number(Boolean(profile.calendlyUrl))
    const isLocalProfile = isLocalProfileHostname(window.location.hostname)
    const resumePath = localizedPath(isLocalProfile ? `/${profileId}/resume` : "/resume")
    const profileBaseUrl = profile.canonicalUrl
    const canonicalUrl = `${profileBaseUrl}${routePrefix}/`
    const meta = (key: string) => t(`${profile.metaKey}.${key}`)

    const hrefForProfile = (nextProfile: ProfileId) => {
        const nextUrl = getProfileSwitchUrl(window.location.href, nextProfile)
        return nextUrl ?? localizedPath(`/${nextProfile}`)
    }

    return (
        <>
            <Helmet>
                <title>{meta("title")}</title>
                <meta name="description" content={meta("description")} />
                <meta name="title" content={meta("title")} />
                <meta property="og:description" content={meta("ogDescription")} />
                <meta property="og:locale" content={t("meta.ogLocale")} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${profileBaseUrl}/og-banner.png`} />
                <meta property="og:image:alt" content="Imbleau" />
                <meta name="twitter:description" content={meta("twitterDescription")} />
                <meta name="twitter:image" content={`${profileBaseUrl}/og-banner.png`} />
                <link rel="canonical" href={canonicalUrl} />
                <link rel="alternate" hrefLang="en-US" href={`${profileBaseUrl}/en/`} />
                <link rel="alternate" hrefLang="x-default" href={`${profileBaseUrl}/`} />
                <link rel="alternate" hrefLang="fr" href={`${profileBaseUrl}/fr/`} />
                <link rel="alternate" hrefLang="fa" href={`${profileBaseUrl}/fa/`} />
                <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        name: profile.fullName,
                        url: canonicalUrl,
                        jobTitle: meta("jobTitle"),
                        description: meta("personDescription"),
                        image: `${profileBaseUrl}/og-banner.png`,
                        ...(profile.nationality ? { nationality: profile.nationality } : {}),
                        sameAs: profile.socials.map(({ href }) => href),
                    })}
                </script>
            </Helmet>

            <Box component="article" sx={{ width: "100%", maxWidth: 1120, mx: "auto", px: { xs: 1, sm: 2.5 } }}>
                <Box
                    component="header"
                    sx={(theme) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.5, sm: 2 },
                        pb: 1,
                        borderBottom: `1px solid ${theme.palette.text.primary}`,
                    })}
                >
                    <ProfileSwitcher
                        value={profileId}
                        label={t("profileSwitcher.label")}
                        hrefForProfile={hrefForProfile}
                    />
                    <Typography
                        title={t(profile.roleKey)}
                        sx={{
                            display: { xs: "none", sm: "block" },
                            minWidth: 0,
                            flex: 1,
                            overflow: "hidden",
                            fontFamily: "Courier New, monospace",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textOverflow: "ellipsis",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {t(profile.roleKey)}
                    </Typography>
                    <LanguageSwitcher />
                </Box>

                <Box
                    component="section"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.35fr) minmax(320px, 0.8fr)" },
                        alignItems: "center",
                        gap: { xs: 3, md: 6 },
                        pt: { xs: 2.5, md: 4 },
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h1"
                        sx={{
                            m: 0,
                            fontSize: { xs: "clamp(5rem, 25vw, 7rem)", md: "9.5rem" },
                            fontWeight: 900,
                            lineHeight: 0.75,
                            letterSpacing: "-0.025em",
                            textTransform: "uppercase",
                            "@media (min-width: 420px) and (max-width: 899.95px)": {
                                fontSize: "clamp(7rem, 18vw, 8.5rem)",
                            },
                        }}
                    >
                        {t("home.headline")}
                    </Typography>

                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            maxWidth: 390,
                            justifySelf: { md: "end" },
                            "@media (min-width: 420px) and (max-width: 899.95px)": {
                                maxWidth: 620,
                                justifySelf: "center",
                            },
                        }}
                    >
                        <Box
                            aria-hidden="true"
                            sx={(theme) => ({
                                position: "absolute",
                                inset: "16px -14px -14px 16px",
                                backgroundColor: theme.palette.primary.main,
                            })}
                        />
                        <CornerFrame>
                            <Box
                                component="img"
                                alt={profile.fullName}
                                src={profile.image}
                                srcSet={profile.imageSrcSet}
                                sizes={PROFILE_HERO_IMAGE_SIZES}
                                fetchPriority="high"
                                loading="eager"
                                sx={{
                                    position: "relative",
                                    display: "block",
                                    width: "100%",
                                    aspectRatio: "1 / 1",
                                    objectFit: "cover",
                                    clipPath: "polygon(0.4% 0, 99.5% 0.7%, 100% 98.8%, 98.6% 100%, 0.5% 99.4%, 0 1.2%)",
                                }}
                            />
                        </CornerFrame>
                        <Typography
                            sx={{
                                position: "absolute",
                                right: { xs: -6, sm: -20 },
                                bottom: { xs: -14, sm: -18 },
                                px: 1.5,
                                py: 0.45,
                                color: "#FCFAF3",
                                backgroundColor: "#D84C2F",
                                fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
                                fontSize: { xs: "1.1rem", sm: "1.35rem" },
                                fontWeight: 800,
                                letterSpacing: "0.025em",
                                textTransform: "uppercase",
                                transform: "rotate(2deg)",
                            }}
                        >
                            {t(profile.stickerKey)}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    component="section"
                    sx={(theme) => ({
                        mt: { xs: 5, md: 4.5 },
                        pt: 1.5,
                        borderTop: `1px solid ${theme.palette.text.primary}`,
                    })}
                >
                    <Typography
                        component="h2"
                        variant="h3"
                        sx={(theme) => ({
                            mb: 1.25,
                            color: theme.palette.primary.main,
                            fontSize: { xs: "2.25rem", sm: "2.8rem" },
                            fontWeight: 900,
                            lineHeight: 1,
                            textTransform: "uppercase",
                        })}
                    >
                        {t("home.startHere")}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: `repeat(${actionCount}, minmax(0, 1fr))`,
                            },
                            gap: 1,
                        }}
                    >
                        <LightButton href={resumePath} variant="primary" fullWidth>
                            <Description sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                            {t("home.resume")}
                        </LightButton>
                        <RevealEmailButton key={profileId} encodedEmail={profile.encodedEmail} />
                        {profile.calendlyUrl && (
                            <LightButton
                                href={profile.calendlyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="secondary"
                                fullWidth
                            >
                                <CalendarMonth sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                                {t("home.scheduleOneOnOne")}
                            </LightButton>
                        )}
                    </Box>
                </Box>

                <Box
                    component="footer"
                    sx={(theme) => ({
                        mt: 2.5,
                        pt: 1.25,
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        containerType: "inline-size",
                        columnGap: 1,
                        rowGap: 0.75,
                        borderTop: `1px solid ${theme.palette.border.main}`,
                    })}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexShrink: 0,
                            gap: 0.25,
                            width: "100%",
                            "& > a": { width: "100%" },
                            "@media (min-width: 380px)": {
                                flexDirection: "row",
                                width: "auto",
                                "& > a": { width: "auto" },
                            },
                        }}
                    >
                        {profile.socials.map(({ kind, label, href }) => (
                            <LightButton
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="tertiary"
                                size="small"
                                fullWidth
                                sx={{
                                    px: 1,
                                    gap: 0.6,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "0.72rem",
                                    letterSpacing: "0.01em",
                                }}
                            >
                                {kind === "linkedin" ? (
                                    <LinkedIn sx={{ fontSize: "1rem" }} />
                                ) : (
                                    <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "1rem" }} />
                                )}
                                {label}
                            </LightButton>
                        ))}
                    </Box>
                    <Typography
                        sx={{
                            marginInlineStart: "auto",
                            whiteSpace: "nowrap",
                            color: "text.inactive",
                            opacity: 0.55,
                            fontFamily: "Courier New, monospace",
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            "@container (max-width: 480px)": {
                                flexBasis: "100%",
                                marginInlineStart: 0,
                                textAlign: "center",
                            },
                        }}
                    >
                        {t("home.madeWith")} <Coffee sx={{ fontSize: "0.8rem", verticalAlign: "-0.15em" }} />{" "}
                        {t("home.andA")} <Keyboard sx={{ fontSize: "0.8rem", verticalAlign: "-0.15em" }} />
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

import { Box, Typography } from "@mui/material"
import ArrowBack from "@mui/icons-material/ArrowBack"
import Description from "@mui/icons-material/Description"
import { Helmet } from "react-helmet-async"
import { CornerFrame } from "@/components/CornerFrame"
import { LightButton } from "@/components/LightButton"
import { useLanguage } from "@/hooks/useLanguage"
import { getCanonicalProfileUrl, getProfile, type ProfileId } from "@/profiles"

export const ResumeUnavailablePage = ({ profile }: { profile: ProfileId }) => {
    const { t, prefix, localizedPath } = useLanguage()
    const profileConfig = getProfile(profile)
    const text = (key: string) => t(`${profileConfig.resumeTextKey}.${key}`)
    const canonicalUrl = `${getCanonicalProfileUrl(profile)}${prefix}/resume`

    return (
        <>
            <Helmet>
                <title>{text("unavailablePageTitle")}</title>
                <meta name="description" content={text("unavailableDescription")} />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>

            <Box sx={{ width: "min(100%, 34rem)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CornerFrame>
                    <Box
                        role="status"
                        sx={(theme) => ({
                            minHeight: { xs: 280, sm: 340 },
                            px: { xs: 3, sm: 6 },
                            py: 6,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.border.light}`,
                        })}
                    >
                        <Box
                            aria-hidden="true"
                            sx={(theme) => ({
                                width: 70,
                                height: 88,
                                mb: 3,
                                display: "grid",
                                placeItems: "center",
                                color: theme.palette.primary.main,
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.text.primary}`,
                                boxShadow: `7px 7px 0 ${theme.palette.primary.main}`,
                            })}
                        >
                            <Description sx={{ fontSize: "2rem" }} />
                        </Box>

                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
                                fontSize: { xs: "2rem", sm: "2.75rem" },
                                fontWeight: 900,
                                lineHeight: 0.95,
                                textTransform: "uppercase",
                            }}
                        >
                            {text("unavailable")}
                        </Typography>
                        <Typography sx={{ mt: 1.25, color: "text.helper", fontSize: "1rem", fontWeight: 500 }}>
                            {text("comingSoon")}
                        </Typography>
                    </Box>
                </CornerFrame>

                <LightButton href={localizedPath("/")} variant="tertiary" size="small" sx={{ mt: 2, px: 1.5 }}>
                    <ArrowBack sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                    {text("goBack")}
                </LightButton>
            </Box>
        </>
    )
}

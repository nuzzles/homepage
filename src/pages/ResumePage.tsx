import { useState } from "react"
import { Box, CircularProgress } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { ArrowBack, Download } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { LightButton } from "@/components/LightButton"
import { useLanguage } from "@/hooks/useLanguage"

const RESUME_PDF_URL = "https://github.com/nuzzles/resume/releases/download/latest/resume.pdf"
const RESUME_EMBED_URL = "https://nuzzles.github.io/resume/embed.html"

const BASE_URL = "https://spencer.imbleau.com"

export const ResumePage = () => {
    const { t, prefix, localizedPath } = useLanguage()
    const canonicalUrl = `${BASE_URL}${prefix}/resume`
    const [loading, setLoading] = useState(true)

    return (
        <>
            <Helmet>
                <title>{t("resumePage.title")}</title>
                <meta name="description" content={t("resumePage.description")} />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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
                        sx={(theme) => ({
                            position: "relative",
                            aspectRatio: "8.5 / 11",
                            height: "calc(100dvh - 120px)",
                            maxHeight: "11in",
                            maxWidth: "min(90vw, 8.5in)",
                            width: "100%",
                            backgroundColor: `${theme.palette.text.primary}11`,
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        })}
                    >
                        {loading && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 1,
                                }}
                            >
                                <CircularProgress size={40} />
                            </Box>
                        )}
                        <Box
                            component="iframe"
                            title={t("resumePage.iframeTitle")}
                            src={RESUME_EMBED_URL}
                            onLoad={() => setLoading(false)}
                            sx={{
                                border: 0,
                                overflow: "hidden",
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <Link to={localizedPath("/")} style={{ textDecoration: "none" }}>
                        <LightButton variant="tertiary" size="small" sx={{ px: 1.5 }}>
                            <ArrowBack sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                            {t("resumePage.goBack")}
                        </LightButton>
                    </Link>
                    <a href={RESUME_PDF_URL} download style={{ textDecoration: "none" }}>
                        <LightButton variant="primary" size="small" sx={{ px: 1.5 }}>
                            <Download sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                            {t("resumePage.downloadResume")}
                        </LightButton>
                    </a>
                </Box>
            </Box>
        </>
    )
}

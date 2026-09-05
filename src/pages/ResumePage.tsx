import { useEffect, useRef, useState } from "react"
import { Box, LinearProgress, Link as MuiLink, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { Helmet } from "react-helmet-async"
import ArrowBack from "@mui/icons-material/ArrowBack"
import Description from "@mui/icons-material/Description"
import Download from "@mui/icons-material/Download"
import { CornerFrame } from "@/components/CornerFrame"
import { LightButton } from "@/components/LightButton"
import { useLanguage } from "@/hooks/useLanguage"
import { getCanonicalProfileUrl, getProfile, getProfileHomePath, type ProfileId } from "@/profiles"

export const ResumePage = ({ profile: profileId }: { profile: ProfileId }) => {
    const { t, prefix, localizedPath } = useLanguage()
    const profile = getProfile(profileId)
    const resume = profile.resume
    const text = (key: string) => t(`resumePage.${key}`, { profile: profile.fullName })
    const canonicalUrl = `${getCanonicalProfileUrl(profileId)}${prefix}/resume`
    const profileHomePath = localizedPath(getProfileHomePath(window.location.hostname, profileId))
    const [loading, setLoading] = useState(true)
    const [showLoadingHelp, setShowLoadingHelp] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [btnWidth, setBtnWidth] = useState<number | undefined>(undefined)
    const btnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!loading) return

        const timeout = window.setTimeout(() => setShowLoadingHelp(true), 4000)
        return () => window.clearTimeout(timeout)
    }, [loading])

    const handleDownload = async () => {
        if (btnRef.current) setBtnWidth(btnRef.current.offsetWidth)
        setDownloading(true)
        setDownloadProgress(0)

        try {
            if (!resume) throw new Error(`No resume configured for ${profileId}`)
            const res = await fetch(resume.pdfUrl)
            if (!res.ok) throw new Error(`Resume download failed with status ${res.status}`)

            const contentLength = res.headers.get("content-length")
            const total = contentLength ? parseInt(contentLength, 10) : 0
            const reader = res.body?.getReader()

            let blob: Blob
            if (reader) {
                const chunks: BlobPart[] = []
                let received = 0

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    chunks.push(value)
                    received += value.length
                    if (total > 0) setDownloadProgress(Math.round((received / total) * 100))
                }
                blob = new Blob(chunks, { type: "application/pdf" })
            } else {
                blob = await res.blob()
            }

            const url = URL.createObjectURL(blob)
            const anchor = document.createElement("a")
            anchor.href = url
            anchor.download = resume.downloadFilename
            document.body.appendChild(anchor)
            anchor.click()
            document.body.removeChild(anchor)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Unable to download the resume directly", error)
            const fallback = document.createElement("a")
            if (!resume) return
            fallback.href = resume.pdfUrl
            fallback.target = "_blank"
            fallback.rel = "noopener noreferrer"
            document.body.appendChild(fallback)
            fallback.click()
            document.body.removeChild(fallback)
        } finally {
            setDownloading(false)
            setDownloadProgress(0)
            setBtnWidth(undefined)
        }
    }

    return (
        <>
            <Helmet>
                <title>{text("title")}</title>
                <meta name="description" content={text("description")} />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>

            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CornerFrame>
                    <Box
                        sx={(theme) => ({
                            position: "relative",
                            aspectRatio: "8.5 / 11",
                            height: "calc(100dvh - 120px)",
                            maxHeight: "11in",
                            maxWidth: "min(calc(100vw - 48px), 8.5in)",
                            width: "100%",
                            backgroundColor: theme.palette.background.elevated,
                            border: `1px solid ${theme.palette.border.light}`,
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        })}
                    >
                        {loading && (
                            <Box
                                role="status"
                                aria-live="polite"
                                sx={(theme) => ({
                                    position: "absolute",
                                    inset: 0,
                                    zIndex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    px: 4,
                                    backgroundColor: theme.palette.background.paper,
                                })}
                            >
                                <Box
                                    aria-hidden="true"
                                    sx={(theme) => ({
                                        position: "relative",
                                        width: 68,
                                        height: 88,
                                        mb: 3,
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            inset: "7px -7px -7px 7px",
                                            backgroundColor: theme.palette.primary.main,
                                        },
                                    })}
                                >
                                    <Box
                                        sx={(theme) => ({
                                            position: "relative",
                                            width: "100%",
                                            height: "100%",
                                            display: "grid",
                                            placeItems: "center",
                                            color: theme.palette.primary.main,
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.text.primary}`,
                                        })}
                                    >
                                        <Description sx={{ fontSize: "2rem" }} />
                                    </Box>
                                </Box>

                                <Typography
                                    sx={{
                                        fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
                                        fontSize: { xs: "1.75rem", sm: "2.25rem" },
                                        fontWeight: 900,
                                        lineHeight: 1,
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {text("loading")}
                                </Typography>

                                <LinearProgress
                                    aria-label={text("loading")}
                                    sx={(theme) => ({
                                        width: "min(180px, 65%)",
                                        height: 4,
                                        mt: 1.5,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.16),
                                        "& .MuiLinearProgress-bar": { backgroundColor: theme.palette.primary.main },
                                    })}
                                />

                                {showLoadingHelp && (
                                    <Box sx={{ mt: 2.5, textAlign: "center" }}>
                                        <Typography sx={{ color: "text.helper", fontSize: "0.8rem" }}>
                                            {text("loadingHelp")}
                                        </Typography>
                                        <MuiLink
                                            href={resume?.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="always"
                                            sx={(theme) => ({
                                                fontFamily: theme.typography.button.fontFamily,
                                                fontSize: "0.8rem",
                                                fontWeight: 700,
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                            })}
                                        >
                                            {text("openPdf")}
                                        </MuiLink>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <Box
                            component="iframe"
                            title={text("iframeTitle")}
                            src={resume?.embedUrl}
                            onLoad={() => setLoading(false)}
                            sx={{
                                border: 0,
                                overflow: "hidden",
                                width: "100%",
                                height: "100%",
                                opacity: loading ? 0 : 1,
                            }}
                        />
                    </Box>
                </CornerFrame>

                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <LightButton href={profileHomePath} variant="tertiary" size="small" sx={{ px: 1.5 }}>
                        <ArrowBack sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                        {text("goBack")}
                    </LightButton>
                    <LightButton
                        ref={btnRef}
                        variant="primary"
                        size="small"
                        sx={{ px: 1.5, overflow: "hidden", position: "relative", minWidth: btnWidth }}
                        onClick={downloading ? undefined : handleDownload}
                    >
                        <Download sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                        {downloading ? (downloadProgress > 0 ? `${downloadProgress}%` : "...") : text("downloadResume")}
                        {downloading && (
                            <LinearProgress
                                variant={downloadProgress > 0 ? "determinate" : "indeterminate"}
                                value={downloadProgress}
                                sx={(theme) => ({
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: alpha(theme.palette.primary.contrastText, 0.7),
                                    },
                                })}
                            />
                        )}
                    </LightButton>
                </Box>
            </Box>
        </>
    )
}

import { useRef, useState } from "react"
import { saveAs } from "file-saver"
import { Box, CircularProgress, LinearProgress } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { ArrowBack, Download } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { LightButton } from "@/components/LightButton"
import { useLanguage } from "@/hooks/useLanguage"

const RESUME_PDF_URL = "https://nuzzles.github.io/resume/resume.pdf"
const RESUME_EMBED_URL = "https://nuzzles.github.io/resume/embed.html"

const BASE_URL = "https://spencer.imbleau.com"

export const ResumePage = () => {
    const { t, prefix, localizedPath } = useLanguage()
    const canonicalUrl = `${BASE_URL}${prefix}/resume`
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [btnWidth, setBtnWidth] = useState<number | undefined>(undefined)
    const btnRef = useRef<HTMLButtonElement>(null)

    const handleDownload = async () => {
        if (btnRef.current) setBtnWidth(btnRef.current.offsetWidth)
        setDownloading(true)
        setDownloadProgress(0)
        try {
            const res = await fetch(RESUME_PDF_URL)
            const contentLength = res.headers.get("content-length")
            const total = contentLength ? parseInt(contentLength, 10) : 0
            const reader = res.body?.getReader()
            if (!reader) return

            const chunks: BlobPart[] = []
            let received = 0
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                chunks.push(value)
                received += value.length
                if (total > 0) setDownloadProgress(Math.round((received / total) * 100))
            }

            const blob = new Blob(chunks, { type: "application/pdf" })
            saveAs(blob, t("resumePage.downloadFilename"))
        } finally {
            setDownloading(false)
            setDownloadProgress(0)
            setBtnWidth(undefined)
        }
    }

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
                            border: `1px solid ${theme.palette.divider}`,
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
                    <LightButton
                        ref={btnRef}
                        variant="primary"
                        size="small"
                        sx={{ px: 1.5, overflow: "hidden", position: "relative", minWidth: btnWidth }}
                        onClick={downloading ? undefined : handleDownload}
                    >
                        <Download sx={{ fontSize: "1rem", marginInlineEnd: 0.5 }} />
                        {downloading
                            ? downloadProgress > 0
                                ? `${downloadProgress}%`
                                : "..."
                            : t("resumePage.downloadResume")}
                        {downloading && (
                            <LinearProgress
                                variant={downloadProgress > 0 ? "determinate" : "indeterminate"}
                                value={downloadProgress}
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: "rgba(255,255,255,0.7)",
                                    },
                                }}
                            />
                        )}
                    </LightButton>
                </Box>
            </Box>
        </>
    )
}

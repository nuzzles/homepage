import { Box } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { ArrowBack, Download } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { LightButton } from "@/components/LightButton"

const RESUME_PDF_URL = "https://github.com/nuzzles/resume/releases/download/latest/resume.pdf"
const RESUME_EMBED_URL = "https://nuzzles.github.io/resume/embed.html"

export const ResumePage = () => {
    return (
        <>
            <Helmet>
                <title>Spencer Imbleau | Résumé</title>
                <meta
                    name="description"
                    content="View or download the résumé of Spencer Imbleau"
                />
            </Helmet>
            <Box
                sx={{
                    alignSelf: "center",
                    maxWidth: 1000,
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
                        sx={(theme) => ({
                            width: "100vw",
                            maxWidth: "8.5in",
                            minHeight: 500,
                            height: "calc(100vh - 230px)",
                            maxHeight: "11in",
                            backgroundColor: `${theme.palette.text.primary}11`,
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        })}
                    >
                        <Box
                            component="iframe"
                            title="Résumé"
                            src={RESUME_EMBED_URL}
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
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <LightButton variant="tertiary" size="small">
                            <ArrowBack sx={{ fontSize: "1rem", mr: 0.5 }} />
                            go back
                        </LightButton>
                    </Link>
                    <a href={RESUME_PDF_URL} download="Spencer_Imbleau_Resume.pdf" style={{ textDecoration: "none" }}>
                        <LightButton variant="primary" size="small">
                            <Download sx={{ fontSize: "1rem", mr: 0.5 }} />
                            download résumé
                        </LightButton>
                    </a>
                </Box>
            </Box>
        </>
    )
}

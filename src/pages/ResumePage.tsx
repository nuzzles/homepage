import { Box, Link as MuiLink } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { Download } from "@mui/icons-material"

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
                    sx={(theme) => ({
                        width: "100vw",
                        maxWidth: "8.5in",
                        minHeight: 500,
                        height: "calc(100vh - 230px)",
                        maxHeight: "11in",
                        backgroundColor: `${theme.palette.text.primary}11`,
                        borderWidth: 3,
                        borderStyle: "solid",
                        borderColor: "text.primary",
                        borderRadius: "10px",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        [`@media not screen and (min-width: calc(8.5in + 4px))`]: {
                            borderLeft: 0,
                            borderRight: 0,
                            borderRadius: 0,
                        },
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

                <MuiLink
                    href={RESUME_PDF_URL}
                    download="Spencer_Imbleau_Resume.pdf"
                    underline="hover"
                    sx={{ mt: 2, display: "inline-flex", alignItems: "center", gap: 0.5 }}
                >
                    click to download résumé
                    <Download sx={{ fontSize: "1rem" }} />
                </MuiLink>
            </Box>
        </>
    )
}

import { Box, Typography } from "@mui/material"
import { OpenInNew } from "@mui/icons-material"
import { Helmet } from "react-helmet-async"
import { LightButton } from "@/components/LightButton"
import { RevealEmailButton } from "@/components/RevealEmailButton"
import { SocialLinks } from "@/components/SocialLinks"
import { Footer } from "@/components/Footer"

const CALENDLY_URL = "https://calendly.com/simbleau/meet"

export const HomePage = () => {
    return (
        <>
            <Helmet>
                <title>Spencer Imbleau | Homepage</title>
                <meta
                    name="description"
                    content="This is the web page of Spencer Imbleau. I am an American research software engineer."
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
                    component="img"
                    alt="Spencer Imbleau"
                    src="/images/me.webp"
                    sx={{
                        borderRadius: "50%",
                        minWidth: 300,
                        width: "min(40vh, 40vw)",
                        maxWidth: 450,
                        minHeight: 300,
                        height: "min(40vh, 40vw)",
                        maxHeight: 450,
                        objectFit: "scale-down",
                    }}
                />

                <Typography variant="h3" component="h1" sx={{ mt: 1, fontWeight: 700 }}>
                    Spencer Imbleau
                </Typography>

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5, width: 280 }}>
                    <RevealEmailButton />
                    <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <LightButton variant="secondary" fullWidth>
                            schedule a meeting
                            <OpenInNew sx={{ fontSize: "1rem", ml: 0.5 }} />
                        </LightButton>
                    </a>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <SocialLinks />
                </Box>

                <Footer />
            </Box>
        </>
    )
}

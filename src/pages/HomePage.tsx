import { Box, Container, Typography } from "@mui/material"
import { CalendarMonth, OpenInNew } from "@mui/icons-material"
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
                    component="img"
                    alt="Spencer Imbleau"
                    src="/images/me.webp"
                    sx={{
                        borderRadius: 0,
                        width: 280,
                        height: 280,
                        objectFit: "cover",
                    }}
                />

                <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 700, width: 280 }}>
                    Spencer Imbleau
                </Typography>

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5, width: 280 }}>
                    <RevealEmailButton />
                    <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <LightButton variant="secondary" fullWidth>
                            <CalendarMonth sx={{ fontSize: "1rem", mr: 0.5 }} />
                            schedule a 1:1
                            <OpenInNew sx={{ fontSize: "1rem", ml: 0.5 }} />
                        </LightButton>
                    </a>
                </Box>

                <Box sx={{ mt: 2, width: 280 }}>
                    <SocialLinks />
                </Box>

                <Footer />
            </Container>
        </>
    )
}

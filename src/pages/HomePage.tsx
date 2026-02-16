import { Box, Typography } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { RevealEmailButton } from "@/components/RevealEmailButton"
import { SocialLinks } from "@/components/SocialLinks"
import { Footer } from "@/components/Footer"

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

                <Box sx={{ mt: 2 }}>
                    <RevealEmailButton />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <SocialLinks />
                </Box>

                <Footer />
            </Box>
        </>
    )
}

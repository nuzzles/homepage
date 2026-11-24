import { Box, Link, Typography } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { CornerFrame } from "@/components/CornerFrame"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath } from "@/profiles"
import { introduction, principles, reflection } from "@/content/howIWork"

export const HowIWorkPage = () => {
    const profile = useProfile()
    const page = profile.howIWork
    if (!page) return null

    const canonicalUrl = `${profile.canonicalUrl}${page.path}`
    const title = `${page.title} | ${profile.fullName}`

    return (
        <>
            <Helmet>
                <html lang="en" dir="ltr" />
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={page.description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={page.description} />
                <meta property="og:type" content="article" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={page.description} />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
            <Box sx={{ width: "100%", maxWidth: 820, py: { xs: 1, sm: 4 } }} lang="en" dir="ltr">
                <Link
                    href={getProfileHomePath(window.location.hostname, profile.id)}
                    underline="hover"
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 3, px: 1, fontWeight: 600 }}
                >
                    <ArrowLeft size={18} aria-hidden="true" />
                    {profile.fullName}
                </Link>
                <CornerFrame>
                    <Box component="article" sx={{ px: { xs: 2, sm: 5 }, py: { xs: 3, sm: 5 } }}>
                        <Typography
                            sx={{
                                color: "primary.main",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontSize: "0.8rem",
                            }}
                        >
                            Personal values
                        </Typography>
                        <Typography
                            component="h1"
                            variant="h1"
                            sx={{
                                my: 1.5,
                                fontSize: { xs: "3.5rem", sm: "5rem" },
                                lineHeight: 1,
                                textTransform: "uppercase",
                            }}
                        >
                            {page.title}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" }, lineHeight: 1.65, mb: 4 }}>
                            {introduction}
                        </Typography>
                        {principles.map(({ title: principle, body }, index) => (
                            <Box
                                component="section"
                                key={principle}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "24px 1fr", sm: "36px 1fr" },
                                    gap: { xs: 1.5, sm: 2 },
                                    py: 2.5,
                                    borderTop: 1,
                                    borderColor: "border.light",
                                }}
                            >
                                <Typography
                                    aria-hidden="true"
                                    sx={{ color: "primary.main", fontWeight: 700, pt: 0.4, fontSize: "0.8rem" }}
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </Typography>
                                <Box>
                                    <Typography
                                        component="h2"
                                        variant="h3"
                                        sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem" }, lineHeight: 1.15, mb: 1 }}
                                    >
                                        {principle}
                                    </Typography>
                                    <Typography sx={{ lineHeight: 1.7 }}>{body}</Typography>
                                </Box>
                            </Box>
                        ))}
                        <Box
                            sx={{
                                mt: 3,
                                p: { xs: 2, sm: 3 },
                                borderLeft: 4,
                                borderColor: "primary.main",
                                backgroundColor: "background.paper",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "primary.main",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    mb: 1,
                                }}
                            >
                                My test
                            </Typography>
                            <Typography sx={{ fontSize: "1.2rem", lineHeight: 1.5, fontWeight: 600 }}>
                                {reflection}
                            </Typography>
                        </Box>
                    </Box>
                </CornerFrame>
            </Box>
        </>
    )
}

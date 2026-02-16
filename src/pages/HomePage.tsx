import { useState } from "react"
import { Box, Container, IconButton, Link as MuiLink, Tooltip, Typography } from "@mui/material"
import {
    Article,
    CalendarMonth,
    Check,
    Coffee,
    ContentCopy,
    Description,
    Email,
    Keyboard,
    LinkedIn,
    OpenInNew,
} from "@mui/icons-material"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquareGithub, faSquareHackerNews } from "@fortawesome/free-brands-svg-icons"
import { LightButton } from "@/components/LightButton"

const CALENDLY_URL = "https://calendly.com/simbleau/meet"

// Obfuscated email — never appears in plaintext in source
const OBF = "c3BlbmNlckBpbWJsZWF1LmNvbQ=="

const socials = [
    { label: "in/simbleau", href: "https://www.linkedin.com/in/simbleau/", icon: <LinkedIn sx={{ fontSize: "1rem" }} /> },
    {
        label: "@nuzzles",
        href: "https://www.github.com/nuzzles/",
        icon: <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "1rem" }} />,
    },
    {
        label: "simbleau",
        href: "https://news.ycombinator.com/user?id=simbleau",
        icon: <FontAwesomeIcon icon={faSquareHackerNews} style={{ fontSize: "1rem" }} />,
    },
    {
        label: "blog",
        href: "https://nuzzles.github.io/",
        icon: <Article sx={{ fontSize: "1rem" }} />,
    },
] as const

const RevealEmailButton = () => {
    const [email, setEmail] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleReveal = () => {
        setEmail(atob(OBF))
    }

    const handleCopy = () => {
        if (email) {
            navigator.clipboard.writeText(email)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (email) {
        return (
            <Box
                sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${theme.palette.border.main}`,
                    backgroundColor: theme.palette.background.paper,
                    height: 50,
                    width: "100%",
                })}
            >
                <MuiLink
                    href={`mailto:${email}`}
                    underline="hover"
                    sx={{
                        flex: 1,
                        px: 1.5,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                    }}
                >
                    {email}
                </MuiLink>
                <Tooltip title={copied ? "copied!" : "copy"}>
                    <IconButton onClick={handleCopy} size="small" sx={{ mr: 0.5 }}>
                        {copied ? <Check sx={{ fontSize: "1.1rem" }} /> : <ContentCopy sx={{ fontSize: "1.1rem" }} />}
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }

    return (
        <LightButton variant="secondary" fullWidth onClick={handleReveal}>
            <Email sx={{ fontSize: "1rem", mr: 0.5 }} />
            reveal email
        </LightButton>
    )
}

const W = { xs: 280, md: 360 }

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
                        component="img"
                        alt="Spencer Imbleau"
                        src="/images/me.webp"
                        sx={{
                            display: "block",
                            width: W,
                            height: W,
                            objectFit: "cover",
                        }}
                    />
                </Box>

                <Typography variant="h5" component="h1" sx={{ mt: 1, fontWeight: 700, width: W, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Spencer Imbleau
                </Typography>

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5, width: W }}>
                    <Link to="/resume" style={{ textDecoration: "none" }}>
                        <LightButton variant="primary" fullWidth>
                            <Description sx={{ fontSize: "1rem", mr: 0.5 }} />
                            résumé
                        </LightButton>
                    </Link>
                    <RevealEmailButton />
                    <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <LightButton variant="secondary" fullWidth>
                            <CalendarMonth sx={{ fontSize: "1rem", mr: 0.5 }} />
                            schedule a 1:1
                            <OpenInNew sx={{ fontSize: "1rem", ml: 0.5 }} />
                        </LightButton>
                    </a>
                </Box>

                <Box sx={{ mt: 2, width: W, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    {socials.map(({ label, href, icon }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <LightButton variant="tertiary" size="small" fullWidth sx={{ px: 1, letterSpacing: "0.05em", fontSize: "0.75rem" }}>
                                {icon}
                                {label}
                                <OpenInNew sx={{ fontSize: "0.65rem", ml: 0.25 }} />
                            </LightButton>
                        </a>
                    ))}
                </Box>

                <Typography variant="body2" sx={{ mt: 2.5 }}>
                    made with <Coffee sx={{ fontSize: "0.9rem", verticalAlign: "middle" }} /> and a{" "}
                    <Keyboard sx={{ fontSize: "1rem", verticalAlign: "middle" }} />
                </Typography>
            </Container>
        </>
    )
}

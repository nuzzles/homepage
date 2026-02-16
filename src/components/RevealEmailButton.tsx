import { useState } from "react"
import { Box, IconButton, Link as MuiLink, Tooltip } from "@mui/material"
import { Email, ContentCopy, Check } from "@mui/icons-material"
import { LightButton } from "@/components/LightButton"

// Obfuscated email — never appears in plaintext in source
const OBF = "c3BlbmNlckBpbWJsZWF1LmNvbQ=="

export const RevealEmailButton = () => {
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
                    minHeight: 48,
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

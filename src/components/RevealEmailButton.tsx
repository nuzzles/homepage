import { useState } from "react"
import { Button, Link as MuiLink } from "@mui/material"

// Obfuscated email — never appears in plaintext in source
const OBF = "c3BlbmNlckBpbWJsZWF1LmNvbQ=="

export const RevealEmailButton = () => {
    const [email, setEmail] = useState<string | null>(null)

    const handleReveal = () => {
        setEmail(atob(OBF))
    }

    if (email) {
        return (
            <MuiLink href={`mailto:${email}`} underline="hover" sx={{ fontSize: "1.1rem" }}>
                {email}
            </MuiLink>
        )
    }

    return (
        <Button
            onClick={handleReveal}
            sx={{
                borderRadius: "10px",
                width: 300,
                height: 50,
                backgroundColor: "text.primary",
                color: "background.default",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                    backgroundColor: "text.secondary",
                },
            }}
        >
            reveal email
        </Button>
    )
}

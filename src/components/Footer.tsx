import { Box, Link as MuiLink, Typography } from "@mui/material"
import { Coffee, Keyboard, OpenInNew } from "@mui/icons-material"

export const Footer = () => {
    return (
        <Box component="footer" sx={{ mt: 2.5, textAlign: "center" }}>
            <Typography variant="body2">
                made with <Coffee sx={{ fontSize: "0.9rem", verticalAlign: "middle" }} /> and a{" "}
                <Keyboard sx={{ fontSize: "1rem", verticalAlign: "middle" }} />
            </Typography>
            <MuiLink
                href="https://github.com/nuzzles/homepage"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: "0.875rem" }}
            >
                view source
                <OpenInNew sx={{ fontSize: "0.8rem", verticalAlign: "baseline" }} />
            </MuiLink>
        </Box>
    )
}

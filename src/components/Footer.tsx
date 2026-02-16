import { Box, Typography } from "@mui/material"
import { Coffee, Keyboard } from "@mui/icons-material"

export const Footer = () => {
    return (
        <Box component="footer" sx={{ mt: 2.5, textAlign: "center" }}>
            <Typography variant="body2">
                made with <Coffee sx={{ fontSize: "0.9rem", verticalAlign: "middle" }} /> and a{" "}
                <Keyboard sx={{ fontSize: "1rem", verticalAlign: "middle" }} />
            </Typography>
        </Box>
    )
}

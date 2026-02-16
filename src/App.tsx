import { Box, Typography } from "@mui/material"

function App() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                gap: 2,
            }}
        >
            <Box
                component="svg"
                viewBox="0 0 100 100"
                sx={{ width: 100, height: 100 }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: "0.05em" }}>
                Spencer Imbleau
            </Typography>
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                Homepage
            </Typography>
        </Box>
    )
}

export default App

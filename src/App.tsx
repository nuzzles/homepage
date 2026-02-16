import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Box } from "@mui/material"
import { HomePage } from "@/pages/HomePage"
import { ResumePage } from "@/pages/ResumePage"

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Box
                    component="main"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        px: 1.25,
                        py: 2.5,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/resume" element={<ResumePage />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </HelmetProvider>
    )
}

export default App

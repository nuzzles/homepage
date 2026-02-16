import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Box } from "@mui/material"
import { NavBar } from "@/components/NavBar"
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
                        mt: 2.5,
                        mx: 1.25,
                        mb: 3.75,
                    }}
                >
                    <NavBar />
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

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Box } from "@mui/material"
import { HomePage } from "@/pages/HomePage"
import { ResumePage } from "@/pages/ResumePage"
import { LanguageRedirect } from "@/components/LanguageRedirect"
import { LocalizedLayout } from "@/components/LocalizedLayout"

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
                        minHeight: "100dvh",
                        px: 1.25,
                        py: 2.5,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<LanguageRedirect />} />

                        <Route element={<LocalizedLayout lang="en" />}>
                            <Route path="/resume" element={<ResumePage />} />
                        </Route>

                        <Route element={<LocalizedLayout lang="fr" />}>
                            <Route path="/fr" element={<HomePage />} />
                            <Route path="/fr/resume" element={<ResumePage />} />
                        </Route>

                        <Route element={<LocalizedLayout lang="fa" />}>
                            <Route path="/fa" element={<HomePage />} />
                            <Route path="/fa/resume" element={<ResumePage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </HelmetProvider>
    )
}

export default App

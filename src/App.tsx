import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Box, CircularProgress } from "@mui/material"
import { HomePage } from "@/pages/HomePage"
import { LanguageRedirect } from "@/components/LanguageRedirect"
import { LocalizedLayout } from "@/components/LocalizedLayout"

const ResumePage = lazy(() => import("@/pages/ResumePage").then((module) => ({ default: module.ResumePage })))

const ResumeRoute = () => (
    <Suspense fallback={<CircularProgress aria-label="Loading résumé" />}>
        <ResumePage />
    </Suspense>
)

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
                            <Route path="/en" element={<HomePage />} />
                            <Route path="/en/resume" element={<ResumeRoute />} />
                            <Route path="/resume" element={<ResumeRoute />} />
                        </Route>

                        <Route element={<LocalizedLayout lang="fr" />}>
                            <Route path="/fr" element={<HomePage />} />
                            <Route path="/fr/resume" element={<ResumeRoute />} />
                        </Route>

                        <Route element={<LocalizedLayout lang="fa" />}>
                            <Route path="/fa" element={<HomePage />} />
                            <Route path="/fa/resume" element={<ResumeRoute />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </HelmetProvider>
    )
}

export default App

import { Fragment, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Box, CircularProgress } from "@mui/material"
import { HomePage } from "@/pages/HomePage"
import { ProfileSelectorPage } from "@/pages/ProfileSelectorPage"
import { ResumeUnavailablePage } from "@/pages/ResumeUnavailablePage"
import { LanguageRedirect } from "@/components/LanguageRedirect"
import { LocalizedLayout } from "@/components/LocalizedLayout"
import { getProfile, isLocalProfileHostname, isProfileId, PROFILE_IDS } from "@/profiles"
import { getConfiguredSite } from "@/site"
import type { ProfileId } from "@/profiles"

const ResumePage = lazy(() => import("@/pages/ResumePage").then((module) => ({ default: module.ResumePage })))

const ResumeRoute = ({ profile }: { profile: ProfileId }) => {
    if (!getProfile(profile).resume) {
        return <ResumeUnavailablePage profile={profile} />
    }

    return (
        <Suspense fallback={<CircularProgress aria-label="Loading résumé" />}>
            <ResumePage profile={profile} />
        </Suspense>
    )
}

const getLocalProfileRoutes = (prefix: "" | "/fr" | "/fa") =>
    PROFILE_IDS.map((profile) => (
        <Fragment key={`${prefix}-${profile}`}>
            <Route path={`${prefix}/${profile}`} element={<HomePage fixedProfile={profile} />} />
            <Route path={`${prefix}/${profile}/resume`} element={<ResumeRoute profile={profile} />} />
        </Fragment>
    ))

function App() {
    const site = getConfiguredSite()
    const isLocal = isLocalProfileHostname(window.location.hostname)
    const profileSite = isProfileId(site) ? site : null
    const homeElement = profileSite ? <HomePage fixedProfile={profileSite} /> : <ProfileSelectorPage />

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
                        <Route path="/" element={<LanguageRedirect>{homeElement}</LanguageRedirect>} />

                        <Route element={<LocalizedLayout lang="en" />}>
                            <Route path="/en" element={homeElement} />
                            {profileSite && (
                                <>
                                    <Route path="/en/resume" element={<ResumeRoute profile={profileSite} />} />
                                    <Route path="/resume" element={<ResumeRoute profile={profileSite} />} />
                                </>
                            )}
                            {isLocal && getLocalProfileRoutes("")}
                        </Route>

                        <Route element={<LocalizedLayout lang="fr" />}>
                            <Route path="/fr" element={homeElement} />
                            {profileSite && <Route path="/fr/resume" element={<ResumeRoute profile={profileSite} />} />}
                            {isLocal && getLocalProfileRoutes("/fr")}
                        </Route>

                        <Route element={<LocalizedLayout lang="fa" />}>
                            <Route path="/fa" element={homeElement} />
                            {profileSite && <Route path="/fa/resume" element={<ResumeRoute profile={profileSite} />} />}
                            {isLocal && getLocalProfileRoutes("/fa")}
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </HelmetProvider>
    )
}

export default App

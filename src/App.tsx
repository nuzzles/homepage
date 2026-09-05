import { Fragment, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Box, CircularProgress } from "@mui/material"
import { HomePage } from "@/pages/HomePage"
import { ProfileSelectorPage } from "@/pages/ProfileSelectorPage"
import { ResumeUnavailablePage } from "@/pages/ResumeUnavailablePage"
import { LanguageRedirect } from "@/components/LanguageRedirect"
import { LocalizedLayout } from "@/components/LocalizedLayout"
import { ProfileProvider } from "@/components/ProfileProvider"
import { useProfile } from "@/hooks/useProfile"
import { isLocalProfileHostname, isProfileId, PROFILE_IDS } from "@/profiles"
import { getConfiguredSite } from "@/site"
import type { ProfileId } from "@/profiles"

const ResumePage = lazy(() => import("@/pages/ResumePage").then((module) => ({ default: module.ResumePage })))

const ProfileHomeRoute = ({ profileId }: { profileId: ProfileId }) => (
    <ProfileProvider profileId={profileId}>
        <HomePage />
    </ProfileProvider>
)

const ResumeContent = () => {
    const profile = useProfile()
    if (!profile.resume) {
        return <ResumeUnavailablePage />
    }

    return (
        <Suspense fallback={<CircularProgress aria-label="Loading résumé" />}>
            <ResumePage />
        </Suspense>
    )
}

const ResumeRoute = ({ profileId }: { profileId: ProfileId }) => (
    <ProfileProvider profileId={profileId}>
        <ResumeContent />
    </ProfileProvider>
)

const getLocalProfileRoutes = (prefix: "/en" | "/fr" | "/fa") =>
    PROFILE_IDS.map((profile) => (
        <Fragment key={`${prefix}-${profile}`}>
            <Route path={`${prefix}/${profile}`} element={<ProfileHomeRoute profileId={profile} />} />
            <Route path={`${prefix}/${profile}/resume`} element={<ResumeRoute profileId={profile} />} />
        </Fragment>
    ))

const getLocalProfileRedirects = () =>
    PROFILE_IDS.flatMap((profile) => [
        <Route key={profile} path={`/${profile}`} element={<LanguageRedirect path={`/${profile}`} />} />,
        <Route
            key={`${profile}-resume`}
            path={`/${profile}/resume`}
            element={<LanguageRedirect path={`/${profile}/resume`} />}
        />,
    ])

function App() {
    const site = getConfiguredSite()
    const isLocal = isLocalProfileHostname(window.location.hostname)
    const profileSite = isProfileId(site) ? site : null
    const homeElement = profileSite ? <ProfileHomeRoute profileId={profileSite} /> : <ProfileSelectorPage />

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
                        {profileSite && <Route path="/resume" element={<LanguageRedirect path="/resume" />} />}
                        {isLocal && getLocalProfileRedirects()}

                        <Route element={<LocalizedLayout lang="en" />}>
                            <Route path="/en" element={homeElement} />
                            {profileSite && (
                                <Route path="/en/resume" element={<ResumeRoute profileId={profileSite} />} />
                            )}
                            {isLocal && getLocalProfileRoutes("/en")}
                        </Route>

                        <Route element={<LocalizedLayout lang="fr" />}>
                            <Route path="/fr" element={homeElement} />
                            {profileSite && (
                                <Route path="/fr/resume" element={<ResumeRoute profileId={profileSite} />} />
                            )}
                            {isLocal && getLocalProfileRoutes("/fr")}
                        </Route>

                        <Route element={<LocalizedLayout lang="fa" />}>
                            <Route path="/fa" element={homeElement} />
                            {profileSite && (
                                <Route path="/fa/resume" element={<ResumeRoute profileId={profileSite} />} />
                            )}
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

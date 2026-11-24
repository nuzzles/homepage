import { Fragment } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { ReadingListPage } from "@/pages/ReadingListPage"
import { HowIWorkPage } from "@/pages/HowIWorkPage"
import { AboutPage } from "@/pages/AboutPage"
import { HomePage } from "@/pages/HomePage"
import { ProfileSelectorPage } from "@/pages/ProfileSelectorPage"
import { ResumeUnavailablePage } from "@/pages/ResumeUnavailablePage"
import { LocalizedLayout } from "@/components/LocalizedLayout"
import { PreferredLanguageLayout } from "@/components/PreferredLanguageLayout"
import { ProfileProvider } from "@/components/ProfileProvider"
import { useProfile } from "@/hooks/useProfile"
import { getProfile, isLocalProfileHostname, isProfileId, PROFILE_IDS } from "@/profiles"
import { getConfiguredSite } from "@/site"
import type { ProfileId } from "@/profiles"

import { ResumePage } from "@/pages/ResumePage"

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

    return <ResumePage />
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

const getLocalUnprefixedProfileRoutes = () =>
    PROFILE_IDS.map((profile) => (
        <Fragment key={profile}>
            <Route path={`/${profile}`} element={<ProfileHomeRoute profileId={profile} />} />
            <Route path={`/${profile}/resume`} element={<ResumeRoute profileId={profile} />} />
        </Fragment>
    ))

function App() {
    const site = getConfiguredSite()
    const isLocal = isLocalProfileHostname(window.location.hostname)
    const profileSite = isProfileId(site) ? site : null
    const homeElement = profileSite ? <ProfileHomeRoute profileId={profileSite} /> : <ProfileSelectorPage />

    const aboutRoutes = (prefix = "") => {
        const page = getProfile("spencer").about
        if (!page) return null
        const element = (
            <ProfileProvider profileId="spencer">
                <AboutPage />
            </ProfileProvider>
        )
        return (
            <>
                {profileSite === "spencer" && <Route path={`${prefix}${page.path}`} element={element} />}
                {isLocal && (!profileSite || profileSite === "spencer") && (
                    <Route path={`${prefix}/spencer${page.path}`} element={element} />
                )}
            </>
        )
    }

    const howIWorkRoutes = (prefix = "") => {
        const page = getProfile("spencer").howIWork
        if (!page) return null
        const element = (
            <ProfileProvider profileId="spencer">
                <HowIWorkPage />
            </ProfileProvider>
        )
        return (
            <>
                {profileSite === "spencer" && <Route path={`${prefix}${page.path}`} element={element} />}
                {isLocal && (!profileSite || profileSite === "spencer") && (
                    <Route path={`${prefix}/spencer${page.path}`} element={element} />
                )}
            </>
        )
    }

    const readingListRoutes = (prefix = "") => {
        const page = getProfile("spencer").readingList
        if (!page) return null
        const element = (
            <ProfileProvider profileId="spencer">
                <ReadingListPage />
            </ProfileProvider>
        )
        return (
            <>
                {profileSite === "spencer" && <Route path={`${prefix}${page.path}`} element={element} />}
                {isLocal && (!profileSite || profileSite === "spencer") && (
                    <Route path={`${prefix}/spencer${page.path}`} element={element} />
                )}
            </>
        )
    }

    return (
        <HelmetProvider>
            <BrowserRouter>
                <main className="app-shell">
                    <Routes>
                        <Route element={<PreferredLanguageLayout />}>
                            {howIWorkRoutes()}
                            {readingListRoutes()}
                            {aboutRoutes()}
                            <Route path="/" element={homeElement} />
                            {profileSite && <Route path="/resume" element={<ResumeRoute profileId={profileSite} />} />}
                            {isLocal && getLocalUnprefixedProfileRoutes()}
                        </Route>

                        <Route element={<LocalizedLayout lang="en" />}>
                            {howIWorkRoutes("/en")}
                            {readingListRoutes("/en")}
                            {aboutRoutes("/en")}
                            <Route path="/en" element={homeElement} />
                            {profileSite && (
                                <Route path="/en/resume" element={<ResumeRoute profileId={profileSite} />} />
                            )}
                            {isLocal && getLocalProfileRoutes("/en")}
                        </Route>

                        <Route element={<LocalizedLayout lang="fr" />}>
                            {howIWorkRoutes("/fr")}
                            {readingListRoutes("/fr")}
                            {aboutRoutes("/fr")}
                            <Route path="/fr" element={homeElement} />
                            {profileSite && (
                                <Route path="/fr/resume" element={<ResumeRoute profileId={profileSite} />} />
                            )}
                            {isLocal && getLocalProfileRoutes("/fr")}
                        </Route>

                        <Route element={<LocalizedLayout lang="fa" />}>
                            {howIWorkRoutes("/fa")}
                            {readingListRoutes("/fa")}
                            {aboutRoutes("/fa")}
                            <Route path="/fa" element={homeElement} />
                            {profileSite && (
                                <Route path="/fa/resume" element={<ResumeRoute profileId={profileSite} />} />
                            )}
                            {isLocal && getLocalProfileRoutes("/fa")}
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </HelmetProvider>
    )
}

export default App

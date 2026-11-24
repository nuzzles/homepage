import { MemoryRouter } from "react-router-dom"
import { ProfileProvider } from "@/components/ProfileProvider"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileFooter } from "@/components/ProfileFooter"
import { BlogChromeContext, type BlogChromeLocation } from "./chrome-context"

export interface BlogChromeProps extends BlogChromeLocation {
    section: "header" | "footer"
}

export function BlogChrome({ section, ...location }: BlogChromeProps) {
    return (
        <MemoryRouter initialEntries={["/blog/"]}>
            <BlogChromeContext.Provider value={location}>
                <ProfileProvider profileId="spencer">
                    {section === "header" ? <ProfileHeader current="blog" /> : <ProfileFooter />}
                </ProfileProvider>
            </BlogChromeContext.Provider>
        </MemoryRouter>
    )
}

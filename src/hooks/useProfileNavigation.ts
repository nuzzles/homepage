import { useContext } from "react"
import { BlogChromeContext } from "@/blog/chrome-context"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath, getSpencerBlogPath, isProfileId } from "@/profiles"
import { getConfiguredSite } from "@/site"

export function useProfileNavigation() {
    const { localizedPath } = useLanguage()
    const profile = useProfile()
    const blogLocation = useContext(BlogChromeContext)
    const site = blogLocation ? null : getConfiguredSite()
    const base = (blogLocation?.homepageURL ?? getProfileHomePath(window.location.hostname, profile.id)).replace(
        /\/$/,
        ""
    )
    return {
        home: localizedPath(base || "/"),
        about: profile.about ? localizedPath(`${base}${profile.about.path}`) : null,
        resume: profile.resume ? localizedPath(`${base}/resume`) : null,
        blog:
            blogLocation?.blogURL ??
            (profile.id === "spencer"
                ? getSpencerBlogPath(window.location.hostname, isProfileId(site) ? site : null)
                : null),
        reloadDocument: Boolean(blogLocation),
    }
}

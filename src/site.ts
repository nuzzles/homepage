import { isProfileId, type ProfileId } from "@/profiles"

export type SiteId = "local" | "selector" | ProfileId

export function getConfiguredSite(): SiteId {
    const site = document.documentElement.dataset.site
    if (site === "selector" || isProfileId(site)) return site
    return "local"
}

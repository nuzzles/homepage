import { Box } from "@mui/material"
import { LightButton } from "@/components/LightButton"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath } from "@/profiles"

export const ProfileDocumentNavigation = ({ current }: { current: "resume" | "howIWork" }) => {
    const { t, localizedPath } = useLanguage()
    const profile = useProfile()
    if (profile.id !== "spencer" || !profile.howIWork) return null

    const basePath = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    const pages = [
        { id: "resume", path: "/resume", label: t("documentNavigation.resume") },
        { id: "howIWork", path: profile.howIWork.path, label: t(profile.howIWork.titleKey) },
    ] as const

    return (
        <Box
            component="nav"
            aria-label={t("documentNavigation.label")}
            sx={{ display: "flex", maxWidth: "calc(100vw - 48px)", mb: 1, gap: 0.5 }}
        >
            {pages.map(({ id, path, label }) => (
                <LightButton
                    key={id}
                    href={localizedPath(`${basePath}${path}`)}
                    aria-current={current === id ? "page" : undefined}
                    variant={current === id ? "primary" : "secondary"}
                    size="small"
                    sx={{ px: { xs: 1, sm: 1.5 }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                    {label}
                </LightButton>
            ))}
        </Box>
    )
}

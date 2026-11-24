import { Button } from "@/components/ui/button"
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
        <nav aria-label={t("documentNavigation.label")} className="document-nav">
            {pages.map(({ id, path, label }) => (
                <Button key={id} asChild variant={current === id ? "default" : "outline"} size="sm">
                    <a href={localizedPath(`${basePath}${path}`)} aria-current={current === id ? "page" : undefined}>
                        {label}
                    </a>
                </Button>
            ))}
        </nav>
    )
}

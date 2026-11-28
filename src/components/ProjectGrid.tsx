import { ExternalLink } from "lucide-react"
import type { ProjectConfig } from "@/profiles"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"

export const ProjectGrid = ({ projects }: { projects?: readonly ProjectConfig[] }) => {
    const profile = useProfile()
    const { t } = useLanguage()
    const items = projects ?? profile.projects
    if (!items?.length) return null
    return (
        <div className="project-grid">
            {items.map((project) => (
                <a
                    className="project-card"
                    href={project.href}
                    key={project.id}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h3>{project.name}</h3>
                    <p className="project-description">{t(project.descriptionKey)}</p>
                    <span className="external-link-marker">
                        <ExternalLink aria-hidden="true" />
                        <span className="sr-only">{t("navigation.newTab")}</span>
                    </span>
                </a>
            ))}
        </div>
    )
}

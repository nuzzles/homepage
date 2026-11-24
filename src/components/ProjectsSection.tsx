import { ExternalLink } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
export const ProjectsSection = () => {
    const profile = useProfile()
    const { t } = useLanguage()
    if (!profile.projects?.length) return null
    return (
        <section id="projects" className="projects-section" aria-labelledby="projects-title">
            <div className="section-heading">
                <h2 id="projects-title">{t("projects.title")}</h2>
            </div>
            <div className="project-grid">
                {profile.projects.map((project) => (
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
        </section>
    )
}

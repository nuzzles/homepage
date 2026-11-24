import { ArrowUpRight, Box, PenTool, ScanLine, Terminal } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
const icons = { box: Box, pen: PenTool, scan: ScanLine, terminal: Terminal }
export const ProjectsSection = () => {
    const profile = useProfile()
    const { t } = useLanguage()
    if (!profile.projects?.length) return null
    return (
        <section id="projects" className="projects-section" aria-labelledby="projects-title">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">{t("projects.eyebrow")}</p>
                    <h2 id="projects-title">{t("projects.title")}</h2>
                </div>
                <p>{t("projects.introduction")}</p>
            </div>
            <div className="project-grid">
                {profile.projects.map((project, index) => {
                    const Icon = icons[project.icon]
                    return (
                        <a className="project-card" href={project.href} key={project.id}>
                            <div className="project-top">
                                <Icon aria-hidden="true" />
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                <ArrowUpRight aria-hidden="true" />
                            </div>
                            <p className="project-category">{t(project.categoryKey)}</p>
                            <h3>{project.name}</h3>
                            <p className="project-description">{t(project.descriptionKey)}</p>
                            <ul className="project-technologies" aria-label={t("projects.technologies")}>
                                {project.technologies.map((tech) => (
                                    <li key={tech}>{tech}</li>
                                ))}
                            </ul>
                        </a>
                    )
                })}
            </div>
        </section>
    )
}

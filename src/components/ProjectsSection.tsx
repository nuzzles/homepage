import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { ProjectGrid } from "@/components/ProjectGrid"
import { useProfileNavigation } from "@/hooks/useProfileNavigation"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
export const ProjectsSection = () => {
    const profile = useProfile()
    const { t } = useLanguage()
    const { projects, reloadDocument } = useProfileNavigation()
    if (!profile.projects?.length) return null
    return (
        <section id="projects" className="projects-section" aria-labelledby="projects-title">
            <div className="section-heading">
                <h2 id="projects-title">{t("projects.title")}</h2>
                {projects && (
                    <Link className="text-link" to={projects} reloadDocument={reloadDocument}>
                        {t("projectsPage.more")} <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
                    </Link>
                )}
            </div>
            <ProjectGrid />
        </section>
    )
}

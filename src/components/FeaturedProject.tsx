import { Star } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import type { ProjectConfig } from "@/profiles"

export const FeaturedProjectLabel = ({ feature }: { feature: NonNullable<ProjectConfig["feature"]> }) => {
    const { t } = useLanguage()
    return (
        <p className="featured-project-label">
            <Star aria-hidden="true" />
            <span className="sr-only">{t("projectsPage.featured")}: </span>
            <span>{t(feature.categoryKey)}</span>
        </p>
    )
}

export const FeaturedProjectImage = ({
    feature,
    eager = false,
}: {
    feature: NonNullable<ProjectConfig["feature"]>
    eager?: boolean
}) => {
    const { t } = useLanguage()
    return (
        <img
            className="featured-project-image"
            src={feature.image}
            alt={t(feature.imageAltKey)}
            width="1440"
            height="900"
            loading={eager ? "eager" : "lazy"}
        />
    )
}

import { Link } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfileNavigation } from "@/hooks/useProfileNavigation"

export const ProfileDocumentLink = ({ current }: { current: "resume" | "howIWork" }) => {
    const { t } = useLanguage()
    const { resume, howIWork } = useProfileNavigation()
    const target = current === "resume" ? howIWork : resume
    if (!target) return null
    return (
        <p className="document-related-link">
            <Link to={target}>
                {t(current === "resume" ? "documentNavigation.seeHowIWork" : "documentNavigation.seeResume")}
            </Link>
        </p>
    )
}

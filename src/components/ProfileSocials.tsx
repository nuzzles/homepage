import { ArrowUpRight } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import { SocialBarAction } from "@/components/SocialBarAction"
const icons = { github: faGithub, linkedin: faLinkedin }
export const ProfileSocials = ({ actionBar = false }: { actionBar?: boolean }) => {
    const { t } = useLanguage()
    const profile = useProfile()
    return (
        <nav className="social-strip" aria-label={t("navigation.socials")}>
            {profile.socials.map(({ kind, label, href }) => {
                const link = (
                    <a key={kind} href={href} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={icons[kind]} aria-hidden="true" />
                        <span>{label}</span>
                        <ArrowUpRight aria-hidden="true" className="social-arrow" />
                    </a>
                )
                return actionBar ? (
                    <SocialBarAction key={kind} asChild>
                        {link}
                    </SocialBarAction>
                ) : (
                    link
                )
            })}
        </nav>
    )
}

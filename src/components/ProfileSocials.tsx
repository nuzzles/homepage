import { ExternalLink } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { EmailDialog } from "@/components/EmailDialog"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import { SocialBarAction } from "@/components/SocialBarAction"
const icons = { github: faGithub, linkedin: faLinkedin }
export const ProfileSocials = ({
    actionBar = false,
    contactActions = false,
}: {
    actionBar?: boolean
    contactActions?: boolean
}) => {
    const { t } = useLanguage()
    const profile = useProfile()
    return (
        <nav className="social-strip" aria-label={t("navigation.socials")}>
            {profile.socials.map(({ kind, label, href }) => {
                const link = (
                    <a key={kind} href={href} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={icons[kind]} aria-hidden="true" />
                        <span>{label}</span>
                        <ExternalLink aria-hidden="true" className="external-link-icon" />
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
            {contactActions && (
                <>
                    {profile.calendlyUrl && (
                        <a href={profile.calendlyUrl} target="_blank" rel="noopener noreferrer">
                            <span className="calendly-icon" aria-hidden="true" />
                            <span>{t("footer.calendly")}</span>
                            <ExternalLink aria-hidden="true" className="external-link-icon" />
                        </a>
                    )}
                    <EmailDialog key={profile.id} encodedEmail={profile.encodedEmail}>
                        <Button variant="ghost" className="rounded-none hover:bg-transparent">
                            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                            <span>{t("home.revealEmail")}</span>
                        </Button>
                    </EmailDialog>
                </>
            )}
        </nav>
    )
}

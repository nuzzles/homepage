import { Link } from "react-router-dom"
import { ExternalLink } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faFilePdf } from "@fortawesome/free-solid-svg-icons"
import { ProfileSocials } from "@/components/ProfileSocials"
import { SocialBarAction } from "@/components/SocialBarAction"
import { EmailDialog } from "@/components/EmailDialog"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import { getProfileHomePath } from "@/profiles"

export const ProfileActions = () => {
    const profile = useProfile()
    const { t, localizedPath } = useLanguage()
    const base = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    return (
        <div className="profile-actions action-strip">
            <ProfileSocials actionBar />
            {profile.calendlyUrl && (
                <SocialBarAction asChild>
                    <a className="schedule-action" href={profile.calendlyUrl} target="_blank" rel="noopener noreferrer">
                        <span className="calendly-icon" aria-hidden="true" />
                        <span>{t("home.scheduleOneOnOne")}</span>
                        <ExternalLink aria-hidden="true" className="external-link-icon" />
                    </a>
                </SocialBarAction>
            )}
            <SocialBarAction asChild>
                <Link className="resume-action" to={localizedPath(`${base}/resume`)}>
                    <FontAwesomeIcon icon={faFilePdf} aria-hidden="true" />
                    {t("home.resume")}
                </Link>
            </SocialBarAction>
            <div className="email-action">
                <EmailDialog key={profile.id} encodedEmail={profile.encodedEmail}>
                    <SocialBarAction>
                        <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                        {t("aboutPage.identity.revealEmail")}
                    </SocialBarAction>
                </EmailDialog>
            </div>
        </div>
    )
}

import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Check, Copy, X } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faFilePdf } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from "react-i18next"
import { ProfileSocials } from "@/components/ProfileSocials"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import { getProfileHomePath } from "@/profiles"

const RevealEmailButton = ({ encodedEmail }: { encodedEmail: string }) => {
    const { t, i18n } = useTranslation()
    const [email, setEmail] = useState<string | null>(null)
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    useEffect(() => () => clearTimeout(timer.current), [])
    const handleCopy = async () => {
        if (!email) return
        clearTimeout(timer.current)
        try {
            await navigator.clipboard.writeText(email)
            setCopyState("copied")
        } catch {
            setCopyState("failed")
        }
        timer.current = setTimeout(() => setCopyState("idle"), 3000)
    }
    const revealedEmail = email ? (
        <DialogContent className="email-dialog" dir={i18n.dir()}>
            <DialogTitle className="email-dialog-title">{t("home.revealEmail")}</DialogTitle>
            <DialogDescription className="email-dialog-address" dir="ltr">
                {email}
            </DialogDescription>
            <div className="email-dialog-actions">
                <Button asChild>
                    <a href={`mailto:${email}`}>
                        <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                        {t("home.composeEmail")}
                        <ArrowUpRight aria-hidden="true" />
                    </a>
                </Button>
                <Button
                    variant="outline"
                    onClick={handleCopy}
                    aria-label={t(copyState === "copied" ? "home.copied" : "home.copyEmail")}
                >
                    {copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    {t(copyState === "copied" ? "home.copied" : "home.copyEmail")}
                </Button>
            </div>
            <span role="status" className={copyState === "failed" ? "mt-2 block text-xs text-destructive" : "sr-only"}>
                {copyState === "copied" ? t("home.copied") : copyState === "failed" ? t("home.copyFailed") : ""}
            </span>
            <DialogClose asChild>
                <Button variant="ghost" size="icon" className="email-dialog-close" aria-label={t("home.closeEmail")}>
                    <X aria-hidden="true" />
                </Button>
            </DialogClose>
        </DialogContent>
    ) : null
    return (
        <div className="email-action">
            <Dialog
                open={Boolean(email)}
                onOpenChange={(open) => {
                    clearTimeout(timer.current)
                    setCopyState("idle")
                    setEmail(open ? atob(encodedEmail) : null)
                }}
            >
                <DialogTrigger asChild>
                    <Button variant="ghost">
                        <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                        {t("home.revealEmail")}
                    </Button>
                </DialogTrigger>
                {revealedEmail}
            </Dialog>
        </div>
    )
}

export const ProfileActions = () => {
    const profile = useProfile()
    const { t, localizedPath } = useLanguage()
    const base = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    return (
        <div className="profile-actions action-strip">
            <ProfileSocials />
            {profile.calendlyUrl && (
                <Button asChild variant="ghost">
                    <a className="schedule-action" href={profile.calendlyUrl} target="_blank" rel="noopener noreferrer">
                        <span className="calendly-icon" aria-hidden="true" />
                        <span>{t("home.scheduleOneOnOne")}</span>
                        <ArrowUpRight aria-hidden="true" className="schedule-arrow" />
                    </a>
                </Button>
            )}
            <Button asChild variant="ghost">
                <Link className="resume-action" to={localizedPath(`${base}/resume`)}>
                    <FontAwesomeIcon icon={faFilePdf} aria-hidden="true" />
                    {t("home.resume")}
                </Link>
            </Button>
            <RevealEmailButton key={profile.id} encodedEmail={profile.encodedEmail} />
        </div>
    )
}

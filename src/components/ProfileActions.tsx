import { useEffect, useRef, useState } from "react"
import { Calendar, Check, Copy, FileText, Mail } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import { getProfileHomePath } from "@/profiles"

const RevealEmailButton = ({ encodedEmail }: { encodedEmail: string }) => {
    const { t } = useTranslation()
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
    if (email)
        return (
            <div className="relative flex min-w-0 items-center rounded-md border border-input bg-card">
                <a className="min-w-0 flex-1 px-3 text-sm font-medium break-all" href={`mailto:${email}`}>
                    {email}
                </a>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    aria-label={t(copyState === "copied" ? "home.copied" : "home.copy")}
                >
                    {copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </Button>
                <span
                    role="status"
                    className={copyState === "failed" ? "absolute top-full mt-1 text-xs text-destructive" : "sr-only"}
                >
                    {copyState === "copied" ? t("home.copied") : copyState === "failed" ? t("home.copyFailed") : ""}
                </span>
            </div>
        )
    return (
        <Button variant="outline" onClick={() => setEmail(atob(encodedEmail))}>
            <Mail aria-hidden="true" />
            {t("home.revealEmail")}
        </Button>
    )
}

export const ProfileActions = () => {
    const profile = useProfile()
    const { t, localizedPath } = useLanguage()
    const base = getProfileHomePath(window.location.hostname, profile.id).replace(/\/$/, "")
    return (
        <div className="profile-actions hero-actions">
            <Button asChild>
                <a href={localizedPath(`${base}/resume`)}>
                    <FileText aria-hidden="true" />
                    {t("home.resume")}
                </a>
            </Button>
            <RevealEmailButton key={profile.id} encodedEmail={profile.encodedEmail} />
            {profile.calendlyUrl && (
                <Button asChild variant="outline">
                    <a href={profile.calendlyUrl} target="_blank" rel="noopener noreferrer">
                        <Calendar aria-hidden="true" />
                        {t("home.scheduleOneOnOne")}
                    </a>
                </Button>
            )}
        </div>
    )
}

import { useEffect, useRef, useState } from "react"
import { Check, Copy, Mail } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ProfileSocials } from "@/components/ProfileSocials"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
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
    const revealedEmail = email ? (
        <PopoverContent
            aria-label={t("home.revealEmail")}
            sideOffset={8}
            collisionPadding={16}
            className="email-popover"
        >
            <div className="flex items-center gap-2">
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
            </div>
            <span role="status" className={copyState === "failed" ? "mt-2 block text-xs text-destructive" : "sr-only"}>
                {copyState === "copied" ? t("home.copied") : copyState === "failed" ? t("home.copyFailed") : ""}
            </span>
        </PopoverContent>
    ) : null
    return (
        <div className="email-action">
            <Popover
                open={Boolean(email)}
                onOpenChange={(open) => {
                    clearTimeout(timer.current)
                    setCopyState("idle")
                    setEmail(open ? atob(encodedEmail) : null)
                }}
            >
                <PopoverTrigger asChild>
                    <Button variant="ghost">
                        <Mail aria-hidden="true" />
                        {t("home.revealEmail")}
                    </Button>
                </PopoverTrigger>
                {revealedEmail}
            </Popover>
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
            <Button asChild variant="ghost">
                <a href={localizedPath(`${base}/resume`)} target="_blank" rel="noopener noreferrer">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M14 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8zM14 2v6h6" />
                        <text
                            x="12"
                            y="17"
                            textAnchor="middle"
                            stroke="none"
                            fill="currentColor"
                            fontSize="7"
                            fontWeight="700"
                        >
                            PDF
                        </text>
                    </svg>
                    {t("home.resume")}
                </a>
            </Button>
            <RevealEmailButton key={profile.id} encodedEmail={profile.encodedEmail} />
            {profile.calendlyUrl && (
                <Button asChild variant="ghost">
                    <a className="schedule-action" href={profile.calendlyUrl} target="_blank" rel="noopener noreferrer">
                        <img src="/images/affiliations/calendly.svg" className="size-4 shrink-0" alt="" />
                        <span>{t("home.scheduleOneOnOne")}</span>
                    </a>
                </Button>
            )}
        </div>
    )
}

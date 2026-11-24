import { useEffect, useRef, useState, type ReactElement } from "react"
import { ExternalLink, Check, Copy, X } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from "react-i18next"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const EmailDialog = ({ encodedEmail, children }: { encodedEmail: string; children: ReactElement }) => {
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
                        <span>{t("home.composeEmail")}</span>
                        <ExternalLink aria-hidden="true" />
                    </a>
                </Button>
                <Button
                    variant="outline"
                    onClick={handleCopy}
                    aria-label={t(copyState === "copied" ? "home.copied" : "home.copyEmail")}
                >
                    {copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    <span>{t(copyState === "copied" ? "home.copied" : "home.copyEmail")}</span>
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
        <Dialog
            open={Boolean(email)}
            onOpenChange={(open) => {
                clearTimeout(timer.current)
                setCopyState("idle")
                setEmail(open ? atob(encodedEmail) : null)
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>
            {revealedEmail}
        </Dialog>
    )
}

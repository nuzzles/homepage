import { ArrowLeft, FileText } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath } from "@/profiles"

export const ResumeUnavailablePage = () => {
    const { t, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const text = (key: string) => t(`resumePage.${key}`, { profile: profile.fullName })
    const canonicalUrl = `${profile.canonicalUrl}${routePrefix}/resume`
    const profileHomePath = localizedPath(getProfileHomePath(window.location.hostname, profile.id))

    return (
        <>
            <Helmet>
                <title>{text("unavailablePageTitle")}</title>
                <meta name="description" content={text("unavailableDescription")} />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>

            <div className="flex w-full max-w-lg flex-col items-center gap-4">
                <LanguageSwitcher />
                <Card className="flex min-h-80 w-full flex-col items-center justify-center gap-5 p-8 text-center">
                    <FileText className="size-10 text-primary" aria-hidden="true" />
                    <h1 className="text-3xl font-semibold">{text("unavailable")}</h1>
                    <p className="text-muted-foreground">{text("comingSoon")}</p>
                </Card>
                <Button asChild variant="ghost" size="sm">
                    <a href={profileHomePath}>
                        <ArrowLeft aria-hidden="true" className="rtl:rotate-180" />
                        {text("goBack")}
                    </a>
                </Button>
            </div>
        </>
    )
}

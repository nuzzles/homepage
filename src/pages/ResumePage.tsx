import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Download, FileText, LoaderCircle } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ProfileDocumentNavigation } from "@/components/ProfileDocumentNavigation"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"
import { getProfileHomePath } from "@/profiles"

export const ResumePage = () => {
    const { t, routePrefix, localizedPath } = useLanguage()
    const profile = useProfile()
    const profileId = profile.id
    const resume = profile.resume
    const text = (key: string) => t(`resumePage.${key}`, { profile: profile.fullName })
    const canonicalUrl = `${profile.canonicalUrl}${routePrefix}/resume`
    const profileHomePath = localizedPath(getProfileHomePath(window.location.hostname, profileId))
    const [loading, setLoading] = useState(true)
    const [showLoadingHelp, setShowLoadingHelp] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [btnWidth, setBtnWidth] = useState<number | undefined>(undefined)
    const btnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!loading) return

        const timeout = window.setTimeout(() => setShowLoadingHelp(true), 4000)
        return () => window.clearTimeout(timeout)
    }, [loading])

    const handleDownload = async () => {
        if (btnRef.current) setBtnWidth(btnRef.current.offsetWidth)
        setDownloading(true)
        setDownloadProgress(0)

        try {
            if (!resume) throw new Error(`No resume configured for ${profileId}`)
            const res = await fetch(resume.pdfUrl)
            if (!res.ok) throw new Error(`Resume download failed with status ${res.status}`)

            const contentLength = res.headers.get("content-length")
            const total = contentLength ? parseInt(contentLength, 10) : 0
            const reader = res.body?.getReader()

            let blob: Blob
            if (reader) {
                const chunks: BlobPart[] = []
                let received = 0

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    chunks.push(value)
                    received += value.length
                    if (total > 0) setDownloadProgress(Math.round((received / total) * 100))
                }
                blob = new Blob(chunks, { type: "application/pdf" })
            } else {
                blob = await res.blob()
            }

            const url = URL.createObjectURL(blob)
            const anchor = document.createElement("a")
            anchor.href = url
            anchor.download = resume.downloadFilename
            document.body.appendChild(anchor)
            anchor.click()
            document.body.removeChild(anchor)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Unable to download the resume directly", error)
            const fallback = document.createElement("a")
            if (!resume) return
            fallback.href = resume.pdfUrl
            fallback.target = "_blank"
            fallback.rel = "noopener noreferrer"
            document.body.appendChild(fallback)
            fallback.click()
            document.body.removeChild(fallback)
        } finally {
            setDownloading(false)
            setDownloadProgress(0)
            setBtnWidth(undefined)
        }
    }

    return (
        <>
            <Helmet>
                <title>{text("title")}</title>
                <meta name="description" content={text("description")} />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>

            <div className="document-page">
                <div className="document-toolbar">
                    <ProfileDocumentNavigation current="resume" />
                    <LanguageSwitcher />
                </div>
                <div className="document-panel relative">
                    {loading && (
                        <div
                            role="status"
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-card px-6 text-center"
                        >
                            <FileText className="size-10 text-primary" aria-hidden="true" />
                            <p className="text-2xl font-semibold">{text("loading")}</p>
                            <LoaderCircle className="size-6 animate-spin text-primary" aria-hidden="true" />
                            {showLoadingHelp && (
                                <div>
                                    <p className="mb-2 text-sm text-muted-foreground">{text("loadingHelp")}</p>
                                    <a
                                        className="text-link"
                                        href={resume?.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {text("openPdf")}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                    <iframe
                        title={text("iframeTitle")}
                        src={resume?.embedUrl}
                        onLoad={() => setLoading(false)}
                        className="size-full border-0"
                        style={{ opacity: loading ? 0 : 1 }}
                    />
                </div>
                <div className="document-actions">
                    <Button asChild variant="ghost" size="sm">
                        <a href={profileHomePath}>
                            <ArrowLeft aria-hidden="true" className="rtl:rotate-180" />
                            {text("goBack")}
                        </a>
                    </Button>
                    <Button
                        ref={btnRef}
                        size="sm"
                        style={{ minWidth: btnWidth }}
                        disabled={downloading}
                        onClick={handleDownload}
                        aria-busy={downloading}
                    >
                        {downloading ? (
                            <LoaderCircle aria-hidden="true" className="animate-spin" />
                        ) : (
                            <Download aria-hidden="true" />
                        )}
                        <span>
                            {downloading
                                ? downloadProgress > 0
                                    ? `${downloadProgress}%`
                                    : text("downloading")
                                : text("downloadResume")}
                        </span>
                    </Button>
                </div>
                <a className="text-link mt-3 text-sm" href={resume?.pdfUrl} target="_blank" rel="noopener noreferrer">
                    {text("openPdf")}
                </a>
            </div>
        </>
    )
}

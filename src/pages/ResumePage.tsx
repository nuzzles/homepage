import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Download, LoaderCircle } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileFooter } from "@/components/ProfileFooter"
import { ProfileDocumentLink } from "@/components/ProfileDocumentLink"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfile } from "@/hooks/useProfile"

export const ResumePage = () => {
    const { t, language, routePrefix } = useLanguage()
    const profile = useProfile()
    const profileId = profile.id
    const resume = profile.resume
    const text = (key: string) => t(`resumePage.${key}`, { profile: profile.fullName })
    const canonicalUrl = `${profile.canonicalUrl}${routePrefix}/resume`
    const [loading, setLoading] = useState(true)
    const [showLoadingHelp, setShowLoadingHelp] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [fileSize, setFileSize] = useState<number | null>(null)
    const fileSizeLabel =
        fileSize === null
            ? null
            : new Intl.NumberFormat(language, {
                  style: "unit",
                  unit: fileSize >= 1_000_000 ? "megabyte" : "kilobyte",
                  unitDisplay: "narrow",
                  maximumFractionDigits: fileSize >= 1_000_000 ? 1 : 0,
              }).format(fileSize / (fileSize >= 1_000_000 ? 1_000_000 : 1_000))
    const [btnWidth, setBtnWidth] = useState<number | undefined>(undefined)
    const btnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!loading) return

        const timeout = window.setTimeout(() => setShowLoadingHelp(true), 4000)
        return () => window.clearTimeout(timeout)
    }, [loading])

    useEffect(() => {
        if (!resume) return
        const controller = new AbortController()
        fetch(resume.pdfUrl, { method: "HEAD", signal: controller.signal })
            .then((response) => {
                const bytes = Number(response.headers.get("content-length"))
                if (response.ok && bytes > 0 && Number.isFinite(bytes) && !controller.signal.aborted) setFileSize(bytes)
            })
            .catch(() => {
                /* Download remains available when file metadata cannot be fetched. */
            })
        return () => controller.abort()
    }, [resume])

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

            setFileSize(blob.size)
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

            <div className="profile-page portfolio-page resume-page">
                <ProfileHeader />
                <header className="about-banner">
                    <h1>{text("iframeTitle")}</h1>
                    <ProfileDocumentLink current="resume" />
                </header>
                <main className="about-layout resume-layout">
                    <aside className="resume-sidebar">
                        <p>{text("documentLanguage")}</p>
                    </aside>
                    <section className="resume-document" aria-label={text("iframeTitle")}>
                        <div className="resume-document-toolbar">
                            <div className="resume-download-actions">
                                <a
                                    className="text-link text-sm"
                                    href={resume?.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {text("openPdf")}
                                    <ArrowUpRight aria-hidden="true" className="size-4" />
                                </a>
                                <Button
                                    ref={btnRef}
                                    size="sm"
                                    style={{ minWidth: btnWidth }}
                                    disabled={downloading}
                                    onClick={handleDownload}
                                    aria-busy={downloading}
                                    aria-label={downloading ? text("downloading") : text("downloadResume")}
                                    title={text("downloadResume")}
                                >
                                    {downloading ? (
                                        <LoaderCircle aria-hidden="true" className="animate-spin" />
                                    ) : (
                                        <Download aria-hidden="true" />
                                    )}
                                    <span aria-hidden="true">
                                        {downloading && downloadProgress > 0 ? `${downloadProgress}%` : fileSizeLabel}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="resume-preview relative">
                            {loading && (
                                <div role="status" className="resume-loading">
                                    <span className="sr-only">{text("loading")}</span>
                                    <div className="resume-skeleton" aria-hidden="true">
                                        <Skeleton className="mb-4 h-8 w-2/5" />
                                        <Skeleton className="mb-10 h-3 w-3/5" />
                                        {[0, 1, 2].map((section) => (
                                            <div className="mb-10" key={section}>
                                                <Skeleton className="mb-5 h-5 w-1/4" />
                                                <Skeleton className="mb-3 h-3 w-full" />
                                                <Skeleton className="mb-3 h-3 w-full" />
                                                <Skeleton className="h-3 w-4/5" />
                                            </div>
                                        ))}
                                    </div>
                                    {showLoadingHelp && (
                                        <div className="resume-loading-help">
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
                    </section>
                </main>
                <ProfileFooter />
            </div>
        </>
    )
}

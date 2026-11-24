import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Download, LoaderCircle } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileFooter } from "@/components/ProfileFooter"
import { ProfileDocumentNavigation } from "@/components/ProfileDocumentNavigation"
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
                </header>
                <main className="about-layout resume-layout">
                    <aside className="resume-sidebar">
                        <ProfileDocumentNavigation current="resume" />
                        <p>{text("introduction")}</p>
                    </aside>
                    <section className="resume-document" aria-label={text("iframeTitle")}>
                        <div className="resume-document-toolbar">
                            <p>{text("documentLanguage")}</p>
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
                                <div
                                    role="status"
                                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-card px-6 text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faFilePdf}
                                        className="size-10 text-primary"
                                        aria-hidden="true"
                                    />
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
                    </section>
                </main>
                <ProfileFooter />
            </div>
        </>
    )
}

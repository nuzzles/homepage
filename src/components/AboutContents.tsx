import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"

const sections = ["status", "projects", "contact", "identity", "disclaimer"] as const

export const AboutContents = () => {
    const { t, language } = useLanguage()
    const [expanded, setExpanded] = useState(true)
    const [active, setActive] = useState<string>(sections[0])

    useEffect(() => {
        let frame = 0
        const update = () => {
            frame = 0
            let current: string = sections[0]
            for (const id of sections) {
                const section = document.getElementById(id)
                if (section && section.getBoundingClientRect().top <= 128) current = id
            }
            const pageHeight = document.documentElement.scrollHeight
            if (pageHeight > window.innerHeight && window.scrollY + window.innerHeight >= pageHeight - 2) {
                current = sections[sections.length - 1]
            }
            setActive(current)
        }
        const schedule = () => {
            if (!frame) frame = window.requestAnimationFrame(update)
        }
        schedule()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        return () => {
            window.cancelAnimationFrame(frame)
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
        }
    }, [language])

    return (
        <aside className="about-contents">
            <nav aria-label={t("aboutPage.contents")}>
                <div className="contents-heading">
                    <p>{t("aboutPage.contents")}</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-expanded={expanded}
                        aria-controls="about-contents-links"
                        aria-label={t(expanded ? "aboutPage.collapseContents" : "aboutPage.expandContents")}
                        onClick={() => setExpanded((value) => !value)}
                    >
                        <span aria-hidden="true">{expanded ? "[−]" : "[+]"}</span>
                    </Button>
                </div>
                <div id="about-contents-links" className="contents-links" hidden={!expanded}>
                    {sections.map((id) => (
                        <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>
                            {t(`aboutPage.${id}.title`)}
                        </a>
                    ))}
                </div>
            </nav>
        </aside>
    )
}

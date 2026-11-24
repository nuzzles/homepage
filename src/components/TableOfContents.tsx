import { useEffect, useState } from "react"
import { ContentsHeader } from "./ContentsHeader"
import { useLanguage } from "@/hooks/useLanguage"

export const TableOfContents = ({ sections }: { sections: { id: string; title: string }[] }) => {
    const { t, language } = useLanguage()
    const [expanded, setExpanded] = useState(true)
    const [active, setActive] = useState<string>(sections[0]?.id ?? "")

    useEffect(() => {
        let frame = 0
        const update = () => {
            frame = 0
            let current: string = sections[0]?.id ?? ""
            for (const { id } of sections) {
                const section = document.getElementById(id)
                if (section && section.getBoundingClientRect().top <= 128) current = id
            }
            const pageHeight = document.documentElement.scrollHeight
            if (pageHeight > window.innerHeight && window.scrollY + window.innerHeight >= pageHeight - 2) {
                current = sections.at(-1)?.id ?? ""
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
    }, [language, sections])

    return (
        <aside className="about-contents table-of-contents">
            <nav aria-label={t("contents.title")}>
                <ContentsHeader
                    labels={{
                        title: t("contents.title"),
                        collapse: t("contents.collapse"),
                        expand: t("contents.expand"),
                    }}
                    controlsId="about-contents-links"
                    expanded={expanded}
                    onToggle={() => setExpanded((value) => !value)}
                />
                <div id="about-contents-links" className="contents-links" hidden={!expanded}>
                    {sections.map(({ id, title }) => (
                        <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>
                            {title}
                        </a>
                    ))}
                </div>
            </nav>
        </aside>
    )
}

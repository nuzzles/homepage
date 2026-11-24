import type { ReactNode } from "react"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { AboutContents } from "./AboutContents"
import { ContentHeading } from "./ContentHeading"
import { remarkHeadingIds } from "@/content/remarkHeadingIds"
import { useLanguage } from "@/hooks/useLanguage"
import { getDir, getHtmlLang } from "@/i18n/i18n"

const headings: Components = {
    h1: ({ id, children }) => (
        <ContentHeading level={1} id={id}>
            {children}
        </ContentHeading>
    ),
    h2: ({ id, children }) => (
        <ContentHeading level={2} id={id}>
            {children}
        </ContentHeading>
    ),
    h3: ({ id, children }) => (
        <ContentHeading level={3} id={id}>
            {children}
        </ContentHeading>
    ),
    h4: ({ id, children }) => (
        <ContentHeading level={4} id={id}>
            {children}
        </ContentHeading>
    ),
    h5: ({ id, children }) => (
        <ContentHeading level={5} id={id}>
            {children}
        </ContentHeading>
    ),
    h6: ({ id, children }) => (
        <ContentHeading level={6} id={id}>
            {children}
        </ContentHeading>
    ),
}

export const MarkdownReadingLayout = ({
    sections,
    introduction,
    navigation,
    labelledBy,
    components,
}: {
    sections: { id: string; title: string; body: string }[]
    introduction?: string
    navigation?: ReactNode
    labelledBy?: string
    components?: Components
}) => {
    const { language } = useLanguage()
    const renderMarkdown = (body: string, prefix: string) => (
        <Markdown
            remarkPlugins={[remarkGfm, [remarkHeadingIds, { prefix }]]}
            components={{ ...components, ...headings }}
        >
            {body}
        </Markdown>
    )
    return (
        <div className="about-layout">
            <div className="markdown-sidebar">
                {navigation && <div className="markdown-document-nav">{navigation}</div>}
                <AboutContents sections={sections} />
            </div>
            <article
                className="about-prose"
                aria-labelledby={labelledBy}
                lang={getHtmlLang(language)}
                dir={getDir(language)}
            >
                {introduction && (
                    <div className="markdown-introduction">{renderMarkdown(introduction, "introduction")}</div>
                )}
                {sections.map(({ id, title, body }) => (
                    <section id={id} key={id}>
                        <ContentHeading anchorId={id}>{title}</ContentHeading>
                        {renderMarkdown(body, id)}
                    </section>
                ))}
            </article>
        </div>
    )
}

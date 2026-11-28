import type { SupportedLanguage } from "@/i18n/i18n"
import { parseMarkdownSections } from "../markdownSections"

const documents = import.meta.glob<string>("./*/*.md", { query: "?raw", import: "default", eager: true })

export const projectContent = (slug: string, language: SupportedLanguage) => {
    const source = documents[`./${slug}/${language}.md`] ?? ""
    return {
        introduction: source.split(/^## /m)[0].trim(),
        sections: parseMarkdownSections(source),
    }
}

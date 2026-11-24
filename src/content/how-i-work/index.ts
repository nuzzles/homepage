import en from "./en.md?raw"
import fr from "./fr.md?raw"
import fa from "./fa.md?raw"
import type { SupportedLanguage } from "@/i18n/i18n"
import { parseMarkdownSections } from "../markdownSections"

const documents = { en, fr, fa }
export const howIWorkContent = (language: SupportedLanguage) => ({
    introduction: documents[language].split(/^## /m)[0].trim(),
    sections: parseMarkdownSections(documents[language]),
})

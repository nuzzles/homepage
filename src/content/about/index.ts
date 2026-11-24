import { parseMarkdownSections } from "../markdownSections"
import en from "./en.md?raw"
import fr from "./fr.md?raw"
import fa from "./fa.md?raw"
import type { SupportedLanguage } from "@/i18n/i18n"

const documents = { en, fr, fa }

export const aboutSections = (language: SupportedLanguage) => parseMarkdownSections(documents[language])

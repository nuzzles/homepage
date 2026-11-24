import en from "./en.md?raw"
import fr from "./fr.md?raw"
import fa from "./fa.md?raw"
import type { SupportedLanguage } from "@/i18n/i18n"

const documents = { en, fr, fa }

// Explicit anchors keep incoming links stable when translated headings change.
export const aboutSections = (language: SupportedLanguage) =>
    [...documents[language].matchAll(/^## (.+) \{#([\w-]+)\}\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(
        ([, title, id, body]) => ({ title, id, body })
    )

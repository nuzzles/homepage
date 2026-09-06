import { describe, expect, it } from "vitest"
import { getLanguageSwitchPath } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

describe("language switching paths", () => {
    it.each([
        ["/", "en", "/en"],
        ["/", "fr", "/fr"],
        ["/", "fa", "/fa"],
        ["/fa", "en", "/en"],
        ["/fa", "fr", "/fr"],
        ["/fr", "en", "/en"],
        ["/fr", "fa", "/fa"],
        ["/fa/resume", "en", "/en/resume"],
        ["/fa/resume", "fr", "/fr/resume"],
        ["/fr/resume", "fa", "/fa/resume"],
    ] satisfies [string, SupportedLanguage, string][])("switches %s to %s at %s", (pathname, language, expected) => {
        expect(getLanguageSwitchPath(pathname, language)).toBe(expected)
    })
})

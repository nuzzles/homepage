import { describe, expect, it } from "vitest"
import { getLanguageSwitchPath, getLocalizedPath } from "@/i18n/i18n"
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

describe("localized paths", () => {
    it.each([
        ["/", "/spencer", "/spencer"],
        ["/", "/sara", "/sara"],
        ["/spencer", "/spencer/resume", "/spencer/resume"],
        ["/en", "/spencer", "/en/spencer"],
        ["/en/", "/sara", "/en/sara"],
        ["/fr", "/spencer", "/fr/spencer"],
        ["/fa/", "/sara", "/fa/sara"],
        ["/fr/spencer", "/spencer/resume", "/fr/spencer/resume"],
    ])("builds %s + %s as %s", (pathname, path, expected) => {
        expect(getLocalizedPath(pathname, path)).toBe(expected)
    })
})

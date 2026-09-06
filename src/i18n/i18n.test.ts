import { describe, expect, it } from "vitest"
import { getLanguageSwitchPath, getLocalizedPath } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

describe("language switching paths", () => {
    it.each([
        ["/", "en", "en", "/"],
        ["/", "fr", "en", "/fr"],
        ["/", "fa", "en", "/fa"],
        ["/fa", "en", "en", "/"],
        ["/fa", "fr", "en", "/fr"],
        ["/fr", "en", "en", "/"],
        ["/fr", "fa", "en", "/fa"],
        ["/fa/resume", "en", "en", "/resume"],
        ["/fa/resume", "fr", "en", "/fr/resume"],
        ["/fr/resume", "fa", "en", "/fa/resume"],
        ["/en", "fr", "fr", "/"],
        ["/en/spencer", "fr", "fr", "/spencer"],
        ["/fr/resume", "fa", "fa", "/resume"],
    ] satisfies [string, SupportedLanguage, SupportedLanguage, string][])(
        "switches %s to %s for a %s browser at %s",
        (pathname, language, browserLanguage, expected) => {
            expect(getLanguageSwitchPath(pathname, language, browserLanguage)).toBe(expected)
        }
    )
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

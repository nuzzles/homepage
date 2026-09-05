import { afterEach, describe, expect, it, vi } from "vitest"
import { CookieJar, JSDOM } from "jsdom"
import {
    detectBrowserLanguage,
    readPreferredLanguage,
    resolvePreferredLanguage,
    savePreferredLanguage,
} from "@/i18n/languagePreference"
import { getProfileSwitchUrl, type ProfileId } from "@/profiles"
import type { SupportedLanguage } from "@/i18n/i18n"

const openPages: JSDOM[] = []

function usePage(url: string, cookieJar = new CookieJar()): CookieJar {
    const page = new JSDOM("<!doctype html>", { cookieJar, url })
    openPages.push(page)
    vi.stubGlobal("window", page.window)
    vi.stubGlobal("document", page.window.document)
    vi.stubGlobal("localStorage", page.window.localStorage)
    return cookieJar
}

afterEach(() => {
    vi.unstubAllGlobals()
    for (const page of openPages.splice(0)) page.window.close()
})

describe("browser language detection", () => {
    it.each([
        ["en-US", "en"],
        ["fr-FR", "fr"],
        ["fa-IR", "fa"],
        ["de-DE", "en"],
    ] satisfies [string, SupportedLanguage][])('detects "%s" as "%s"', (browserLanguage, expected) => {
        expect(detectBrowserLanguage([browserLanguage])).toBe(expected)
    })

    it.each([
        ["spencer.imbleau.com", "fr-FR", "fr"],
        ["sara.imbleau.com", "fa-IR", "fa"],
        ["spencer-dev.imbleau.com", "en-US", "en"],
        ["sara-dev.imbleau.com", "fr-CA", "fr"],
    ] satisfies [string, string, SupportedLanguage][])(
        "uses the detected browser language on a fresh %s root",
        (hostname, browserLanguage, expected) => {
            usePage(`https://${hostname}/`)

            expect(resolvePreferredLanguage([browserLanguage])).toBe(expected)
            expect(readPreferredLanguage()).toBe(expected)
            expect(localStorage.getItem("preferredLanguage")).toBe(expected)
        }
    )
})

describe("shared profile language preference", () => {
    it.each(["en", "fr", "fa"] satisfies SupportedLanguage[])(
        "uses a saved %s preference on both production profiles",
        (language) => {
            const cookies = usePage("https://spencer.imbleau.com/")
            savePreferredLanguage(language)

            usePage("https://sara.imbleau.com/", cookies)
            expect(resolvePreferredLanguage([language === "fa" ? "en-US" : "fa-IR"])).toBe(language)

            usePage("https://spencer.imbleau.com/", cookies)
            expect(readPreferredLanguage()).toBe(language)
        }
    )

    it("migrates an existing local preference to the shared cookie", () => {
        const cookies = usePage("https://spencer.imbleau.com/")
        localStorage.setItem("preferredLanguage", "fr")

        expect(readPreferredLanguage()).toBe("fr")

        usePage("https://sara.imbleau.com/", cookies)
        expect(readPreferredLanguage()).toBe("fr")
    })
})

describe("profile switching", () => {
    it.each([
        ["https://spencer.imbleau.com/", "sara", "en"],
        ["https://sara.imbleau.com/", "spencer", "fr"],
        ["https://spencer-dev.imbleau.com/", "sara", "fa"],
        ["https://sara-stg.imbleau.com/", "spencer", "en"],
    ] satisfies [string, ProfileId, SupportedLanguage][])(
        "keeps the saved language when switching from %s to %s at root",
        (sourceUrl, nextProfile, language) => {
            const cookies = usePage(sourceUrl)
            savePreferredLanguage(language)
            const destination = getProfileSwitchUrl(sourceUrl, nextProfile)

            expect(destination).not.toBeNull()
            expect(new URL(destination!).pathname).toBe("/")

            usePage(destination!, cookies)
            expect(resolvePreferredLanguage([language === "fa" ? "en-US" : "fa-IR"])).toBe(language)
        }
    )

    it.each([
        ["/fa", "fa"],
        ["/fr", "fr"],
        ["/fa/resume", "fa"],
        ["/fr/resume", "fr"],
    ] satisfies [string, SupportedLanguage][])(
        "keeps the %s route and preference when switching profiles",
        (pathname, language) => {
            const sourceUrl = `https://spencer-dev.imbleau.com${pathname}`
            const cookies = usePage(sourceUrl)
            savePreferredLanguage(language)
            const destination = getProfileSwitchUrl(sourceUrl, "sara")

            expect(destination).not.toBeNull()
            expect(new URL(destination!).pathname).toBe(pathname)

            usePage(destination!, cookies)
            expect(readPreferredLanguage()).toBe(language)
        }
    )
})

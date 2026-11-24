import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import App from "@/App"
import i18n, { type SupportedLanguage } from "@/i18n/i18n"
import { savePreferredLanguage } from "@/i18n/languagePreference"
import en from "@/i18n/locales/en.json"
import fr from "@/i18n/locales/fr.json"
import fa from "@/i18n/locales/fa.json"

const translations = { en, fr, fa }
let container: HTMLDivElement
let root: Root

beforeEach(async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline in test")))
    localStorage.clear()
    document.cookie = "preferredLanguage=; Path=/; Max-Age=0"
    await i18n.changeLanguage("en")
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
})

afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
    delete document.documentElement.dataset.site
    localStorage.clear()
    document.cookie = "preferredLanguage=; Path=/; Max-Age=0"
    window.history.replaceState({}, "", "/")
})

const renderPage = async (site: string, path: string) => {
    document.documentElement.dataset.site = site
    window.history.replaceState({}, "", path)
    await act(async () =>
        root.render(
            <>
                <App />
            </>
        )
    )
}

const languages: SupportedLanguage[] = ["en", "fr", "fa"]

describe("Reading list", () => {
    it.each(languages)("renders the books and localized footer in %s", async (language) => {
        await renderPage("spencer", `/${language}/books`)
        expect(container.querySelector("h1")?.textContent).toBe(translations[language].readingListPage.title)
        expect([...container.querySelectorAll(".reading-list-books h3")].map((h) => h.textContent)).toEqual([
            "Zero to One",
            "The 7 Habits of Highly Effective People",
            "Software Architecture: The Hard Parts",
            "Rust for Rustaceans",
            "NASA Systems Engineering Handbook",
            "The International Space Station: Operating an Outpost in the New Frontier",
            "Agile Software Development: Principles, Patterns, and Practices",
            "The Rust Programming Language (1st edition)",
        ])
        expect(
            [...container.querySelectorAll(".reading-list-year")].map((section) =>
                section.getAttribute("aria-labelledby")
            )
        ).toEqual(["year-2026", "year-2025", "year-2023", "year-2021", "year-2019", "year-2018"])
        expect(container.querySelector(".reading-list-content")?.getAttribute("dir")).toBe(
            language === "fa" ? "rtl" : "ltr"
        )
        expect(container.querySelector(`.footer-links a[href="/${language}/spencer/books"]`)).not.toBeNull()
        expect(container.querySelector('.footer-links a[href="/blog/stats/"]')).not.toBeNull()
    })
    it.each(["", "/en", "/fr", "/fa"])("redirects the old %s reading URL", async (prefix) => {
        await renderPage("spencer", `${prefix}/reading-list`)
        expect(window.location.pathname).toBe(`${prefix}/books`)
        expect(container.querySelectorAll(".book-cover")).toHaveLength(8)
        expect(container.querySelector('a[href="https://bookshop.org/"]')?.getAttribute("target")).toBe("_blank")
    })
    it.each(languages)("respects the saved %s language on unprefixed routes", async (language) => {
        savePreferredLanguage(language)
        await renderPage("spencer", "/books")
        expect(container.querySelector("h1")?.textContent).toBe(translations[language].readingListPage.title)
        expect(window.location.pathname).toBe("/books")
    })
    it.each(["", "/en", "/fr", "/fa"])("supports the joint preview at %s", async (prefix) => {
        await renderPage("local", `${prefix}/spencer/books/`)
        expect(container.querySelector(".reading-list-content")).not.toBeNull()
        expect(container.querySelector('.footer-links a[href="/spencer/blog/stats/"]')).not.toBeNull()
    })
    it.each(["sara", "selector"])("does not expose Spencer's reading list on %s", async (site) => {
        await renderPage(site, "/books")
        expect(container.querySelector(".reading-list-content")).toBeNull()
        expect(container.querySelector('.footer-links a[href$="/books"]')).toBeNull()
    })
})

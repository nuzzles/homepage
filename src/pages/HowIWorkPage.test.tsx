import { howIWorkContent } from "@/content/how-i-work"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import App from "@/App"
import i18n, { languageConfig, type SupportedLanguage } from "@/i18n/i18n"
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

describe("How I Work routing", () => {
    it.each(languages)("keeps the page visible while the PDF loads in %s", async (language) => {
        await renderPage("spencer", `/${language}/resume`)
        expect(container.querySelector(".site-navigation")).not.toBeNull()
        expect(container.querySelector(".document-related-link")).not.toBeNull()
        expect(container.querySelector(".profile-footer")).not.toBeNull()
        expect(container.querySelector(".resume-document-toolbar p")?.textContent).toBe(
            translations[language].resumePage.documentLanguage
        )
        expect(container.querySelector(".resume-sidebar")).toBeNull()
        const preview = container.querySelector(".resume-preview")!
        expect(preview.querySelector('[role="status"]')?.textContent).toContain(
            translations[language].resumePage.loading
        )
        expect(preview.querySelector(".resume-skeleton")).not.toBeNull()
        await act(async () => preview.querySelector("iframe")!.dispatchEvent(new Event("load")))
        expect(preview.querySelector(".resume-loading")).toBeNull()
        expect(preview.querySelector("iframe")!.style.opacity).toBe("1")
    })

    it.each([
        { size: "1500000", label: "1.5MB" },
        { size: null, label: "" },
    ])("shows download metadata accessibly for size $size", async ({ size, label }) => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, headers: { get: () => size } }))
        await renderPage("spencer", "/en/resume")
        await vi.waitFor(async () => {
            await act(async () => {})
            expect(container.querySelector('.resume-download-actions button[aria-label="Download"]')).not.toBeNull()
        })
        const controls = container.querySelector(".resume-download-actions")!
        expect(controls.querySelector("button")?.textContent).toBe(label)
        expect(controls.querySelector("a")?.textContent).toBe("Open PDF")
        expect(controls.querySelector("button")?.disabled).toBe(false)
        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "HEAD" }))
    })

    const routes = languages.flatMap((language) =>
        ["spencer", "local"].flatMap((site) =>
            ["", "/"].map((slash) => ({
                language,
                site,
                path: `/${language}${site === "local" ? "/spencer" : ""}/how-i-work${slash}`,
            }))
        )
    )

    it.each(routes)("renders $path on $site in $language", async ({ language, site, path }) => {
        savePreferredLanguage(language === "en" ? "fr" : "en")
        await renderPage(site, path)
        const copy = translations[language].howIWorkPage
        const article = container.querySelector("article")!
        expect(container.querySelector("h1")?.textContent).toBe(copy.title)
        expect(article.querySelectorAll("h2")).toHaveLength(10)
        for (const principle of howIWorkContent(language).sections) {
            expect(article.textContent).toContain(principle.title)
            expect(article.textContent).toContain(principle.body.trim())
        }
        expect(article.textContent).toContain(howIWorkContent(language).introduction)
        expect(article.lang).toBe(languageConfig[language].htmlLang)
        expect(article.dir).toBe(languageConfig[language].dir)
        expect(container.querySelector(".site-navigation")).not.toBeNull()
        expect(container.querySelector(".profile-footer")).not.toBeNull()
        expect(container.querySelector(`.document-related-link a[href="/${language}/spencer/resume"]`)).not.toBeNull()
        expect(container.querySelector('.heading-anchor[href="#purpose"]')).not.toBeNull()
        expect(window.location.pathname).toBe(path)
    })

    it.each(languages)("uses the saved %s preference without changing the bare route", async (language) => {
        savePreferredLanguage(language)
        await renderPage("spencer", "/how-i-work")
        expect(container.querySelector("h1")?.textContent).toBe(translations[language].howIWorkPage.title)
        expect(window.location.pathname).toBe("/how-i-work")
        expect(container.querySelector('.document-related-link a[href="/spencer/resume"]')).not.toBeNull()
    })

    it("opens the unprefixed local Spencer route", async () => {
        await renderPage("local", "/spencer/how-i-work")
        expect(container.querySelector("h1")?.textContent).toBe(en.howIWorkPage.title)
    })

    it.each(["", "/en", "/fr", "/fa"])("links How I Work only from Spencer's %s homepage footer", async (prefix) => {
        await renderPage("local", `${prefix}/spencer`)
        const links = container.querySelectorAll(`a[href="${prefix}/spencer/how-i-work"]`)
        expect(links).toHaveLength(1)
        expect(links[0].closest(".footer-links")).not.toBeNull()
        expect(links[0].previousElementSibling?.getAttribute("href")).toBe(`${prefix}/spencer/resume`)
    })

    it.each(["", "/en", "/fr", "/fa"])("connects both documents with the %s prefix", async (prefix) => {
        await renderPage("local", `${prefix}/spencer/resume`)
        await vi.waitFor(async () => {
            await act(async () => {})
            expect(container.querySelector(".document-related-link")).not.toBeNull()
        })
        const nav = container.querySelector(".document-related-link")!
        expect(nav.closest(".about-banner")).not.toBeNull()
        expect(nav.querySelectorAll("a")).toHaveLength(1)
        expect(container.querySelector(".segmented-control")).toBeNull()
        expect(nav.querySelector(`a[href="${prefix}/spencer/how-i-work"]`)).not.toBeNull()
        expect(container.querySelector("iframe")).not.toBeNull()
        expect(container.querySelector(".site-navigation")).not.toBeNull()
        expect(container.querySelector(".profile-footer")).not.toBeNull()

        await act(async () => {
            nav.querySelector<HTMLAnchorElement>(`a[href="${prefix}/spencer/how-i-work"]`)!.click()
        })
        expect(window.location.pathname).toBe(`${prefix}/spencer/how-i-work`)
        const valuesNav = container.querySelector(".document-related-link")!
        expect(valuesNav.closest(".about-banner")).not.toBeNull()
        expect(valuesNav.querySelectorAll("a")).toHaveLength(1)
        expect(valuesNav.querySelector(`a[href="${prefix}/spencer/resume"]`)).not.toBeNull()
        expect(container.querySelector('article[aria-labelledby="how-i-work-title"]')).not.toBeNull()
    })

    const unavailable = ["", "/en", "/fr", "/fa"].flatMap((prefix) => [
        { site: "sara", path: `${prefix}/how-i-work` },
        { site: "sara", path: `${prefix}/spencer/how-i-work` },
        { site: "selector", path: `${prefix}/how-i-work` },
        { site: "local", path: `${prefix}/sara/how-i-work` },
    ])
    it.each(unavailable)("does not show Spencer's page at $path on $site", async ({ site, path }) => {
        await renderPage(site, path)
        expect(container.querySelector('article[aria-labelledby="how-i-work-title"]')).toBeNull()
        expect(container.querySelector('a[href$="/how-i-work"]')).toBeNull()
    })
})

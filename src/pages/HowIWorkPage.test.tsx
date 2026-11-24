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
        expect(article.querySelectorAll("h2")).toHaveLength(9)
        for (const principle of copy.principles) {
            expect(article.textContent).toContain(principle.title)
            expect(article.textContent).toContain(principle.body)
        }
        expect(article.textContent).toContain(copy.reflection)
        expect(article.lang).toBe(languageConfig[language].htmlLang)
        expect(article.dir).toBe(languageConfig[language].dir)
        expect(container.querySelector(`a[href="/${language}/spencer"]`)?.textContent).toBe(
            translations[language].resumePage.goBack
        )
        expect(window.location.pathname).toBe(path)
    })

    it.each(languages)("uses the saved %s preference without changing the bare route", async (language) => {
        savePreferredLanguage(language)
        await renderPage("spencer", "/how-i-work")
        expect(container.querySelector("h1")?.textContent).toBe(translations[language].howIWorkPage.title)
        expect(window.location.pathname).toBe("/how-i-work")
        expect(container.querySelector('a[href="/spencer"]')?.textContent).toBe(
            translations[language].resumePage.goBack
        )
    })

    it("opens the unprefixed local Spencer route", async () => {
        await renderPage("local", "/spencer/how-i-work")
        expect(container.querySelector("h1")?.textContent).toBe(en.howIWorkPage.title)
    })

    it.each(["", "/en", "/fr", "/fa"])("keeps How I Work off Spencer's %s homepage", async (prefix) => {
        await renderPage("local", `${prefix}/spencer`)
        expect(container.querySelector(`a[href="${prefix}/spencer/how-i-work"]`)).toBeNull()
    })

    it.each(["", "/en", "/fr", "/fa"])("connects both documents with the %s prefix", async (prefix) => {
        await renderPage("local", `${prefix}/spencer/resume`)
        await vi.waitFor(async () => {
            await act(async () => {})
            expect(container.querySelector("nav")).not.toBeNull()
        })
        const nav = container.querySelector("nav")!
        expect(nav.querySelector('a[aria-current="page"]')?.getAttribute("href")).toBe(`${prefix}/spencer/resume`)
        expect(nav.querySelector(`a[href="${prefix}/spencer/how-i-work"]`)).not.toBeNull()
        expect(container.querySelector("iframe")).not.toBeNull()

        await act(async () => {
            window.history.pushState({}, "", `${prefix}/spencer/how-i-work`)
            window.dispatchEvent(new PopStateEvent("popstate"))
        })
        const valuesNav = container.querySelector("nav")!
        expect(valuesNav.querySelector('a[aria-current="page"]')?.getAttribute("href")).toBe(
            `${prefix}/spencer/how-i-work`
        )
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

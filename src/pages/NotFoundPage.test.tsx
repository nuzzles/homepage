import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import App from "@/App"
import i18n, { languageConfig, supportedLanguages } from "@/i18n/i18n"
import { savePreferredLanguage } from "@/i18n/languagePreference"
import { notFoundDocument } from "@/notFoundDocument"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root
let container: HTMLDivElement
beforeEach(async () => {
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
    delete document.documentElement.dataset.site
    localStorage.clear()
    document.cookie = "preferredLanguage=; Path=/; Max-Age=0"
    window.history.replaceState({}, "", "/")
})

describe("translated missing pages", () => {
    for (const site of ["spencer", "sara", "selector", "local"]) {
        it.each(supportedLanguages)(
            `${site} honors the explicit %s language and preserves the missing URL`,
            async (lang) => {
                savePreferredLanguage(lang === "fr" ? "en" : "fr")
                const path = `/${lang}${site === "local" ? "/spencer" : ""}/missing?from=old#section`
                document.documentElement.dataset.site = site
                window.history.replaceState({}, "", path)
                await act(async () => root.render(<App />))
                expect(container.querySelector("h1")?.textContent).toBe(i18n.getFixedT(lang)("notFound.title"))
                expect(document.documentElement.dir).toBe(languageConfig[lang].dir)
                expect(document.documentElement.lang).toBe(languageConfig[lang].htmlLang)
                expect(window.location.pathname + window.location.search + window.location.hash).toBe(path)
                const home = site === "selector" ? `/${lang}` : `/${lang}/${site === "local" ? "spencer" : site}`
                const link = [...container.querySelectorAll("a")].find(
                    (a) => a.textContent === i18n.t("notFound.goHome")
                )!
                expect(link.getAttribute("href")).toBe(home)
                expect(container.querySelector('button[aria-label="English Only"]')).toBeNull()
                expect(container.querySelector('[aria-haspopup="menu"]')).not.toBeNull()
            }
        )
    }
    it.each(supportedLanguages)("uses the saved %s preference for a missing blog post", async (lang) => {
        savePreferredLanguage(lang)
        document.documentElement.dataset.site = "spencer"
        window.history.replaceState({}, "", "/blog/missing-post/")
        await act(async () => root.render(<App />))
        expect(container.querySelector("h1")?.textContent).toBe(i18n.getFixedT(lang)("notFound.title"))
        expect(window.location.pathname).toBe("/blog/missing-post/")
        expect(container.querySelector('button[aria-label="English Only"]')).toBeNull()
        const trigger = container.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!
        await act(async () => {
            trigger.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0 }))
        })
        const french = document.querySelector<HTMLAnchorElement>('[role="menuitem"][lang="fr"]')!
        expect(french.getAttribute("href")).toBe("/fr/blog/missing-post/")
    })
    it("builds an unindexed error document without changing app assets or profile identity", () => {
        const html =
            '<html data-site="sara"><head><title>Sara</title><meta name="robots" content="index, follow"></head><body><div id="root"></div><script src="/assets/homepage-abc.js"></script></body></html>'
        const page = new DOMParser().parseFromString(notFoundDocument(html), "text/html")
        expect(page.documentElement.dataset.site).toBe("sara")
        expect(page.title).toBe("404")
        expect(page.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, follow")
        expect(page.querySelector("script")?.getAttribute("src")).toBe("/assets/homepage-abc.js")
    })
})

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest"
import App from "@/App"
import i18n from "@/i18n/i18n"
import en from "@/i18n/locales/en.json"
import fr from "@/i18n/locales/fr.json"
import fa from "@/i18n/locales/fa.json"
import { savePreferredLanguage } from "@/i18n/languagePreference"
import { getProfile } from "@/profiles"
const translations = { en, fr, fa }
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
const render = async (site: string, path: string) => {
    document.documentElement.dataset.site = site
    window.history.replaceState({}, "", path)
    await act(async () => root.render(<App />))
}
const languages = ["en", "fr", "fa"] as const

describe("About and portfolio routes", () => {
    it.each(["/en/spencer#projects", "/fr/spencer/about#contact"])(
        "scrolls to the requested section when loading %s",
        async (path) => {
            const original = HTMLElement.prototype.scrollIntoView
            const scrolled: string[] = []
            HTMLElement.prototype.scrollIntoView = vi.fn(function (this: HTMLElement) {
                scrolled.push(this.id)
            })
            try {
                await render("local", path)
                expect(scrolled).toContain(path.split("#")[1])
            } finally {
                HTMLElement.prototype.scrollIntoView = original
            }
        }
    )
    it.each(
        languages.flatMap((lang) =>
            ["spencer", "local"].flatMap((site) =>
                ["", "/"].map((slash) => ({
                    lang,
                    site,
                    path: `/${lang}${site === "local" ? "/spencer" : ""}/about${slash}`,
                }))
            )
        )
    )("renders $path on $site", async ({ lang, site, path }) => {
        await render(site, path)
        const copy = translations[lang]
        expect(container.querySelector("h1")?.textContent).toBe(copy.aboutPage.title)
        expect(container.querySelector("article")?.textContent).toContain(copy.aboutPage.background.body)
        expect(container.querySelectorAll("article h2")).toHaveLength(5)
        expect(container.querySelector('#blog a[href="https://github.com/nuzzles/homepage"]')?.textContent).toContain(
            "GitHub"
        )
        expect(container.querySelector('a[aria-current="page"]')?.textContent).toBe(copy.navigation.about)
        expect(container.querySelector(`a[href="/${lang}/spencer/resume"]`)).not.toBeNull()
        expect(container.querySelector('a[href="https://calendly.com/simbleau/meet"]')).not.toBeNull()
        expect(container.querySelector("button[aria-expanded]")).not.toBeNull()
        expect(container.querySelector('#blog a[href="https://creativecommons.org/licenses/by/4.0/"]')).not.toBeNull()
        expect(container.querySelector('#blog a[href="https://www.apache.org/licenses/LICENSE-2.0"]')).not.toBeNull()
        expect(container.querySelector('#blog a[href="https://github.com/nuzzles/homepage/issues"]')).not.toBeNull()
        expect(container.querySelector('a[href$="/how-i-work"]')).toBeNull()
        expect(document.documentElement.dir).toBe(lang === "fa" ? "rtl" : "ltr")
        expect(window.location.pathname).toBe(path)
    })
    it.each(languages)("honors the saved %s preference on the bare About route", async (lang) => {
        savePreferredLanguage(lang)
        await render("spencer", "/about")
        expect(container.querySelector("h1")?.textContent).toBe(translations[lang].aboutPage.title)
        expect(window.location.pathname).toBe("/about")
    })
    it.each(["", "/en", "/fr", "/fa"])("keeps About off Sara and the joint site at %s", async (prefix) => {
        await render("sara", `${prefix}/about`)
        expect(container.querySelector(".about-page")).toBeNull()
        await render("local", `${prefix}/sara/about`)
        expect(container.querySelector(".about-page")).toBeNull()
        await render("selector", `${prefix}/about`)
        expect(container.querySelector(".about-page")).toBeNull()
    })
    it.each(languages)("links to About and all selected projects in %s", async (lang) => {
        await render("local", `/${lang}/spencer`)
        expect(container.querySelector(`a[href="/${lang}/spencer/about"]`)).not.toBeNull()
        const projectSection = container.querySelector("#projects")!
        for (const project of getProfile("spencer").projects!) {
            expect(projectSection.querySelector(`a[href="${project.href}"]`)?.textContent).toContain(project.name)
        }
        expect(projectSection.querySelectorAll(".project-card")).toHaveLength(4)
        expect(container.querySelectorAll(".action-strip .social-strip a")).toHaveLength(2)
        expect(container.querySelector(".social-strip")?.textContent).toContain("GitHub")
        expect(container.querySelector(".social-strip")?.textContent).toContain("LinkedIn")
    })
})

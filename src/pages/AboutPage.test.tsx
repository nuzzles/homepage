import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest"
import App from "@/App"
import i18n from "@/i18n/i18n"
import { aboutSections } from "@/content/about"
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
    vi.restoreAllMocks()
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
    it("collapses and expands the contents with an accessible toggle", async () => {
        await render("local", "/en/spencer/about")
        const toggle = container.querySelector<HTMLButtonElement>('button[aria-controls="about-contents-links"]')!
        const links = container.querySelector<HTMLElement>("#about-contents-links")!
        expect(container.querySelector(".table-of-contents .contents-heading p")?.textContent).toBe("Contents")
        expect(toggle.getAttribute("aria-expanded")).toBe("true")
        await act(async () => toggle.click())
        expect(links.hidden).toBe(true)
        expect(toggle.getAttribute("aria-label")).toBe("Expand contents")
        await act(async () => toggle.click())
        expect(links.hidden).toBe(false)
        expect(toggle.getAttribute("aria-expanded")).toBe("true")
    })

    it("highlights the section reached by scrolling in either direction", async () => {
        const frames: FrameRequestCallback[] = []
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
            frames.push(callback)
            return frames.length
        })
        const ids = ["status", "projects", "contact", "identity", "disclaimer"]
        let offset = 0
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
            return { top: ids.indexOf(this.id) * 400 - offset } as DOMRect
        })
        const frame = async () => act(async () => frames.splice(0).forEach((callback) => callback(0)))
        await render("local", "/en/spencer/about")
        await frame()
        const active = () => container.querySelector('.about-contents [aria-current="location"]')?.getAttribute("href")
        expect(active()).toBe("#status")
        offset = 850
        window.dispatchEvent(new Event("scroll"))
        await frame()
        expect(active()).toBe("#contact")
        offset = 400
        window.dispatchEvent(new Event("scroll"))
        await frame()
        expect(active()).toBe("#projects")
    })

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
        expect(container.querySelector("#status")?.textContent).toContain(
            aboutSections(lang)[0].body.split("\n").filter(Boolean).at(-1)
        )
        expect(
            [...container.querySelectorAll("article h2 .heading-title")].map((heading) => heading.textContent)
        ).toEqual(
            (["status", "projects", "contact", "identity", "disclaimer"] as const).map(
                (key) => copy.aboutPage[key].title
            )
        )
        for (const { id, title } of aboutSections(lang)) {
            const heading = container.querySelector(`#${id} h2`)!
            const anchor = heading.querySelector(".heading-anchor")!
            expect(anchor.getAttribute("href")).toBe(`#${id}`)
            expect(anchor.getAttribute("aria-label")).toBe(copy.heading.permalink.replace("{{heading}}", title))
            expect(heading.querySelector(".marker-underline")?.textContent).toBe(title)
        }
        expect(container.querySelector('.identity-table a[href="https://www.github.com/nuzzles/"]')?.textContent).toBe(
            "@nuzzles"
        )
        expect(
            container.querySelector('.identity-table a[href="https://www.linkedin.com/in/simbleau/"]')?.textContent
        ).toBe("/in/simbleau")
        expect(
            container.querySelector('#disclaimer a[href="https://github.com/nuzzles/homepage"]')?.textContent
        ).toContain("GitHub")
        expect(container.querySelector('a[aria-current="page"]')?.textContent).toBe(copy.navigation.about)
        expect(container.querySelector(`a[href="/${lang}/spencer/resume"]`)).not.toBeNull()
        expect(
            container.querySelector('.identity-table a[href="https://calendly.com/simbleau/meet"]')?.textContent
        ).toBe("simbleau")
        for (const link of container.querySelectorAll(".identity-table a")) {
            expect(link.querySelector(".external-link-icon")).not.toBeNull()
        }
        expect(container.querySelector(".identity-email-trigger svg")).toBeNull()
        expect(container.querySelector("#contact .action-strip")).toBeNull()
        expect(container.querySelector(".identity-email-trigger")?.textContent).toBe(
            copy.aboutPage.identity.revealEmail
        )
        expect(container.querySelector("button[aria-expanded]")).not.toBeNull()
        expect(
            container.querySelector('#disclaimer a[href="https://creativecommons.org/licenses/by/4.0/"]')
        ).not.toBeNull()
        expect(
            container.querySelector('#disclaimer a[href="https://www.apache.org/licenses/LICENSE-2.0"]')
        ).not.toBeNull()
        expect(
            container.querySelector('#disclaimer a[href="https://github.com/nuzzles/homepage/issues"]')
        ).not.toBeNull()
        expect(container.querySelector('.footer-links a[href$="/how-i-work"]')).not.toBeNull()
        expect(document.documentElement.dir).toBe(lang === "fa" ? "rtl" : "ltr")
        expect(window.location.pathname).toBe(path)
    })
    it("opens the shared email dialog from Identity and restores focus when closed", async () => {
        await render("spencer", "/about")
        const trigger = container.querySelector<HTMLButtonElement>(".identity-email-trigger")!
        await act(async () => trigger.click())
        const dialog = document.querySelector('[role="dialog"]')!
        expect(dialog.querySelector('a[href^="mailto:"]')?.textContent).toContain(en.home.composeEmail)
        expect(dialog.querySelector(`[aria-label="${en.home.copyEmail}"]`)).not.toBeNull()
        await act(async () => dialog.querySelector<HTMLButtonElement>(`[aria-label="${en.home.closeEmail}"]`)!.click())
        expect(document.querySelector('[role="dialog"]')).toBeNull()
        await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
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
        expect(projectSection.querySelectorAll(".project-card")).toHaveLength(getProfile("spencer").projects!.length)
        expect(container.querySelectorAll(".action-strip .social-strip a")).toHaveLength(2)
        expect(container.querySelector(".social-strip")?.textContent).toContain("GitHub")
        expect(container.querySelector(".social-strip")?.textContent).toContain("LinkedIn")
    })
})

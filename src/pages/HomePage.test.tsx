import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import App from "@/App"
import i18n from "@/i18n/i18n"
import { getProfile } from "@/profiles"

let container: HTMLDivElement
let root: Root

beforeEach(async () => {
    vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    title: "Published post",
                    url: "/blog/published.html",
                    date: "2026-09-14T00:00:00Z",
                    description: "An actual feed entry.",
                },
                { title: "Unsafe URL", url: "javascript:alert(1)", date: "2026-09-14", description: "Invalid" },
            ],
        })
    )
    localStorage.clear()
    document.documentElement.dataset.site = "spencer"
    window.history.replaceState({}, "", "/en/spencer")
    await i18n.changeLanguage("en")
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => root.render(<App />))
})
afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    delete document.documentElement.dataset.site
    window.history.replaceState({}, "", "/")
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

const button = (name: string) => [...container.querySelectorAll("button")].find((el) => el.textContent === name)!
const reveal = async () => act(async () => button("Email").click())

describe("profile controls", () => {
    it("opens a labeled email dialog with compose and copy actions, and closes with Escape", async () => {
        await reveal()
        const dialog = document.querySelector('[role="dialog"]')!
        expect(document.getElementById(dialog.getAttribute("aria-labelledby")!)?.textContent).toBe("Email")
        expect(dialog.querySelector('a[href^="mailto:"]')?.textContent).toBe("Compose email")
        expect(dialog.querySelector('button[aria-label="Copy email"]')).not.toBeNull()
        expect(document.querySelector(".dialog-backdrop")).not.toBeNull()
        await act(async () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })))
        expect(document.querySelector('[role="dialog"]')).toBeNull()
    })

    it("reveals email only after activation and announces a successful copy", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        vi.stubGlobal("navigator", { clipboard: { writeText } })
        expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
        await reveal()
        const email = atob(getProfile("spencer").encodedEmail)
        expect(document.querySelector('a[href^="mailto:"]')?.getAttribute("href")).toBe(`mailto:${email}`)
        await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="Copy email"]')!.click())
        expect(writeText).toHaveBeenCalledWith(email)
        expect(document.querySelector('[role="status"]')?.textContent).toBe("Copied!")
    })

    it("keeps the email link available and explains clipboard failure", async () => {
        vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } })
        await reveal()
        await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="Copy email"]')!.click())
        expect(document.querySelector('[role="status"]')?.textContent).toContain("Could not copy")
        expect(document.querySelector('a[href^="mailto:"]')).not.toBeNull()
    })

    it("shows the complete introduction without an expansion control", () => {
        expect(container.querySelector(".biography")?.textContent).toContain("Blue Origin")
        expect(container.querySelector(".biography")?.textContent).toContain("Rust triage team member")
        expect(container.querySelector(".biography")?.textContent).toContain("Linebender maintainer")
        expect(container.querySelector(".biography button")).toBeNull()
        expect(container.querySelector('button[aria-label="Choose profile"]')).toBeNull()
    })
    it("opens every project in a new tab with an external-link marker", () => {
        const cards = [...container.querySelectorAll(".project-card")]
        expect(cards).toHaveLength(4)
        for (const card of cards) {
            expect(card.getAttribute("target")).toBe("_blank")
            expect(card.getAttribute("rel")).toContain("noopener")
            expect(card.querySelector(".external-link-marker")).not.toBeNull()
            expect(card.querySelector(".project-category, .project-technologies")).toBeNull()
        }
    })
    it("keeps the blog link usable when the latest feed fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")))
        await act(async () => root.render(<App key="offline" />))
        expect(container.querySelector(".latest-list")?.textContent).toBe("")
        expect(container.querySelector(".latest-section a")?.getAttribute("href")).toBe("/blog/")
    })

    it("loads published posts and rejects URLs outside the blog", () => {
        expect(fetch).toHaveBeenCalledWith("/blog/latest.json", expect.any(Object))
        expect(container.querySelector(".latest-list")?.textContent).toContain("Published post")
        expect(container.querySelector(".latest-list")?.textContent).not.toContain("Unsafe URL")
        expect(container.querySelector(".latest-list a")?.getAttribute("target")).toBe("_blank")
    })
})

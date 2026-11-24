import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import App from "@/App"
import i18n from "@/i18n/i18n"
import { getProfile } from "@/profiles"

let container: HTMLDivElement
let root: Root

beforeEach(async () => {
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
const reveal = async () => act(async () => button("Reveal Email").click())

describe("profile controls", () => {
    it("reveals email only after activation and announces a successful copy", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        vi.stubGlobal("navigator", { clipboard: { writeText } })
        expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
        await reveal()
        const email = atob(getProfile("spencer").encodedEmail)
        expect(container.querySelector('a[href^="mailto:"]')?.getAttribute("href")).toBe(`mailto:${email}`)
        await act(async () => container.querySelector<HTMLButtonElement>('button[aria-label="Copy"]')!.click())
        expect(writeText).toHaveBeenCalledWith(email)
        expect(container.querySelector('[role="status"]')?.textContent).toBe("Copied!")
    })

    it("keeps the email link available and explains clipboard failure", async () => {
        vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } })
        await reveal()
        await act(async () => container.querySelector<HTMLButtonElement>('button[aria-label="Copy"]')!.click())
        expect(container.querySelector('[role="status"]')?.textContent).toContain("Could not copy")
        expect(container.querySelector('a[href^="mailto:"]')).not.toBeNull()
    })

    it("expands and collapses the affiliation details", async () => {
        const expand = button("Read more...")
        expect(expand.getAttribute("aria-expanded")).toBe("false")
        await act(async () => expand.click())
        expect(expand.getAttribute("aria-expanded")).toBe("true")
        expect(document.getElementById(expand.getAttribute("aria-controls")!)?.textContent).toContain("Rust triage")
        await act(async () => expand.click())
        expect(expand.getAttribute("aria-expanded")).toBe("false")
    })
})

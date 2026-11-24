import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import App from "@/App"
import { ThemeWrapper } from "@/ThemeWrapper"
import "@/i18n/i18n"

let container: HTMLDivElement
let root: Root

beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
})

afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    delete document.documentElement.dataset.site
    window.history.replaceState({}, "", "/")
})

describe("How I Work routing", () => {
    it.each([
        ["spencer", "/how-i-work"],
        ["spencer", "/how-i-work/"],
        ["local", "/spencer/how-i-work"],
    ])("opens the manifesto directly on %s at %s", async (site, path) => {
        document.documentElement.dataset.site = site
        window.history.replaceState({}, "", path)

        await act(async () =>
            root.render(
                <ThemeWrapper>
                    <App />
                </ThemeWrapper>
            )
        )

        expect(container.querySelector("h1")?.textContent).toBe("How I Work")
        expect(container.querySelector("article")?.textContent).toContain("Let evidence change my mind")
        expect(container.querySelector("article")?.textContent).toContain("Did I make the work clearer")
        expect(container.querySelector('a[href="/spencer"]')?.textContent).toBe("Spencer Imbleau")
        expect(container.querySelector('[lang="en"][dir="ltr"]')).not.toBeNull()
    })

    it("does not present Spencer's values as Sara's page", async () => {
        document.documentElement.dataset.site = "sara"
        window.history.replaceState({}, "", "/how-i-work")

        await act(async () =>
            root.render(
                <ThemeWrapper>
                    <App />
                </ThemeWrapper>
            )
        )

        expect(container.querySelector("h1")?.textContent).not.toBe("How I Work")
        expect(container.textContent).not.toContain("Let evidence change my mind")
        expect(container.querySelector('a[href$="/how-i-work"]')).toBeNull()
    })
})

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { StatsInteractions } from "./StatsInteractions"

let root: Root
beforeEach(async () => {
    document.body.innerHTML = `<svg><a role="button" tabindex="0" href="/blog/one/" data-stats-popup="day-test" aria-expanded="false"><rect width="10" height="10" /></a></svg>
        <template id="day-test"><p>September 14, 2026</p><a href="/blog/one/">First post</a><a href="/blog/two/">Second post</a></template>
        <button data-stats-popup="value" data-popup-label="January 2025" data-popup-value="0 posts" aria-expanded="false">January</button><div id="stats-root"></div>`
    root = createRoot(document.getElementById("stats-root")!)
    await act(async () => root.render(<StatsInteractions />))
})
afterEach(async () => {
    await act(async () => root.unmount())
    document.body.replaceChildren()
})

describe("stats popovers", () => {
    it("shows all posts for a hovered day without moving focus", async () => {
        const trigger = document.querySelector('[data-stats-popup="day-test"]')!
        await act(async () => trigger.dispatchEvent(new Event("pointerenter")))
        const dialog = document.querySelector('[role="dialog"]')!
        expect(dialog.getAttribute("aria-label")).toBe("September 14, 2026")
        expect([...dialog.querySelectorAll("a")].map((a) => new URL(a.href).pathname)).toEqual([
            "/blog/one/",
            "/blog/two/",
        ])
        expect(trigger.getAttribute("aria-expanded")).toBe("true")
        expect(dialog.contains(document.activeElement)).toBe(false)
    })
    it("opens post links with the keyboard and restores focus on Escape", async () => {
        const trigger = document.querySelector<SVGElement>('[data-stats-popup="day-test"]')!
        await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })))
        expect(document.activeElement?.textContent).toBe("First post")
        await act(async () =>
            document.activeElement?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
        )
        expect(document.querySelector('[role="dialog"]')).toBeNull()
        expect(document.activeElement).toBe(trigger)
        expect(trigger.getAttribute("aria-expanded")).toBe("false")
    })
    it("shows zero values on click and closes from the dismiss button", async () => {
        const trigger = document.querySelector<HTMLButtonElement>('[data-stats-popup="value"]')!
        await act(async () => trigger.click())
        expect(document.querySelector(".stats-popover-value")?.textContent).toBe("0 posts")
        expect(document.querySelector('[role="dialog"]')?.getAttribute("aria-label")).toBe("January 2025")
        await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Close details"]')!.click())
        expect(document.querySelector('[role="dialog"]')).toBeNull()
        expect(document.activeElement).toBe(trigger)
    })
})

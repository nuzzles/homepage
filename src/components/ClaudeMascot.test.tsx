import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ClaudeMascot } from "./ClaudeMascot"

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: () => "Make Claude happy" }) }))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

afterEach(() => {
    vi.useRealTimers()
    document.body.replaceChildren()
})

describe("footer mascot interaction", () => {
    it("tracks the pointer, sleeps, wakes, reacts to clicks, and cleans up on unmount", async () => {
        vi.useFakeTimers()
        vi.setSystemTime(0)
        const container = document.createElement("div")
        document.body.append(container)
        const root = createRoot(container)
        await act(async () =>
            root.render(
                <footer>
                    <ClaudeMascot />
                </footer>
            )
        )
        const button = container.querySelector("button")!
        const footer = container.querySelector("footer")!
        const measure = vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
            x: 100,
            y: 100,
            left: 100,
            top: 100,
            right: 148,
            bottom: 148,
            width: 48,
            height: 48,
            toJSON: () => ({}),
        })
        await act(async () => window.dispatchEvent(new MouseEvent("pointermove", { clientX: 200, clientY: 124 })))
        expect(button.dataset.state).toBe("neutral")
        expect(measure).not.toHaveBeenCalled()
        await act(async () => footer.dispatchEvent(new MouseEvent("pointermove", { clientX: 200, clientY: 124 })))
        expect(button.dataset.state).toBe("right")
        measure.mockClear()
        await act(async () => footer.dispatchEvent(new MouseEvent("pointerleave")))
        await act(async () => window.dispatchEvent(new MouseEvent("pointermove", { clientX: 0, clientY: 124 })))
        expect(button.dataset.state).toBe("right")
        expect(measure).not.toHaveBeenCalled()
        await act(async () => vi.advanceTimersByTime(8000))
        expect(button.querySelector("img")?.getAttribute("src")).toBe("/images/claude/sleeping.svg")
        await act(async () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" })))
        expect(button.dataset.state).toBe("right")
        await act(async () => button.click())
        expect(button.dataset.state).toBe("happy")
        await act(async () => vi.advanceTimersByTime(2000))
        expect(button.dataset.state).toBe("right")
        await act(async () => root.unmount())
        expect(vi.getTimerCount()).toBe(0)
    })
})

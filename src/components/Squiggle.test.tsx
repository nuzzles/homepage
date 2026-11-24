import { act } from "react"
import { createRoot } from "react-dom/client"
import { expect, it, vi } from "vitest"
import { Squiggle } from "./Squiggle"

it("continues forward to the original wave after pointer exit and stops animating", async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextId = 0
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
        frames.set(++nextId, callback)
        return nextId
    })
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id))
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    const step = async (time: number) => {
        const pending = [...frames.values()]
        frames.clear()
        await act(async () => pending.forEach((callback) => callback(time)))
    }
    try {
        await act(async () =>
            root.render(
                <a href="/">
                    <Squiggle>Spencer</Squiggle>
                </a>
            )
        )
        const link = container.querySelector("a")!
        const path = container.querySelector("path")!
        const initial = path.getAttribute("d")
        const firstY = () => Number(path.getAttribute("d")!.match(/^M2 ([\d.]+)/)![1])
        await act(async () => link.dispatchEvent(new Event("pointerenter")))
        await step(100)
        await step(150)
        expect(firstY()).toBeGreaterThan(6)
        await act(async () => link.dispatchEvent(new Event("pointerleave")))
        await step(300)
        await step(1075)
        // A backward reset stays above the center; the next forward cycle crosses below it.
        expect(firstY()).toBeLessThan(6)
        await step(2000)
        expect(path.getAttribute("d")).toBe(initial)
        expect(frames.size).toBe(0)
    } finally {
        await act(async () => root.unmount())
        container.remove()
        vi.unstubAllGlobals()
    }
})

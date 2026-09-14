import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = '<article class="post-content"></article>'
    document.body.removeAttribute("style")
    vi.spyOn(window, "scrollTo").mockImplementation(() => {})
    // jsdom has no modal or scrolling implementation; exercise the viewer's event handling.
    HTMLDialogElement.prototype.showModal = function () {
        this.open = true
    }
    HTMLDialogElement.prototype.close = function () {
        this.open = false
        this.dispatchEvent(new Event("close"))
    }
    HTMLElement.prototype.scrollTo = () => {}
})

afterEach(() => {
    vi.restoreAllMocks()
    delete HTMLDialogElement.prototype.showModal
    delete HTMLDialogElement.prototype.close
    delete HTMLElement.prototype.scrollTo
})

async function loadImages(markup) {
    document.querySelector(".post-content").innerHTML = markup
    await import("../../public/blog-media.js")
    return {
        image: document.querySelector(".post-content img"),
        dialog: document.querySelector("dialog"),
    }
}

describe("shared blog image viewing", () => {
    it("opens plain images from the keyboard and restores focus and body styles on close", async () => {
        document.body.style.backgroundColor = "red"
        const originalStyle = document.body.getAttribute("style")
        const { image, dialog } = await loadImages('<img src="/image.png" alt="A diagram">')

        image.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }))
        expect(dialog.open).toBe(true)
        expect(dialog.querySelector("img").alt).toBe("A diagram")
        expect(document.body.style.position).toBe("fixed")

        dialog.querySelector("button").click()
        expect(dialog.open).toBe(false)
        expect(document.activeElement).toBe(image)
        expect(document.body.getAttribute("style")).toBe(originalStyle)
    })

    it("uses an image link's full-size destination instead of its thumbnail", async () => {
        const { image, dialog } = await loadImages('<a href="/full.png"><img src="/thumb.png" alt="Chart"></a>')

        image.click()

        expect(dialog.open).toBe(true)
        expect(dialog.querySelector("img").getAttribute("src")).toMatch(/\/full\.png$/)
    })

    it("preserves images used as navigation links", async () => {
        const { image, dialog } = await loadImages('<a href="/another-post"><img src="/image.png" alt="Read more"></a>')

        expect(image.classList.contains("enlargeable-image")).toBe(false)
        expect(image.closest("a").hasAttribute("aria-haspopup")).toBe(false)
        const click = new MouseEvent("click", { bubbles: true, cancelable: true })
        // Prevent jsdom from trying to navigate after checking the viewer's handler.
        image.closest("a").addEventListener("click", (event) => {
            expect(event.defaultPrevented).toBe(false)
            event.preventDefault()
        })
        image.dispatchEvent(click)
        expect(dialog.open).toBe(false)
    })

    it("leaves modified image-link clicks to the browser", async () => {
        const { image, dialog } = await loadImages('<a href="/full.png"><img src="/thumb.png" alt="Chart"></a>')
        const click = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true })
        image.closest("a").addEventListener("click", (event) => {
            expect(event.defaultPrevented).toBe(false)
            event.preventDefault()
        })

        image.dispatchEvent(click)

        expect(dialog.open).toBe(false)
    })
})

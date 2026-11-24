import { afterEach, describe, expect, it, vi } from "vitest"
import { initializeContents } from "../../public/reading-navigation.js"

let cleanup = () => {}
afterEach(() => {
    cleanup()
    document.body.replaceChildren()
    vi.restoreAllMocks()
})
function setup(body) {
    document.body.innerHTML = `<aside data-contents hidden><nav><button aria-expanded="true"><span>[−]</span></button><div class="contents-links"></div></nav></aside><article data-reading-content>${body}</article>`
    cleanup = initializeContents()
}

describe("Markdown article navigation", () => {
    it("preserves authored anchors, nesting, and safe heading text", () => {
        setup(
            '<h2 id="existing">Rendering <code>&lt;pixels&gt;</code></h2><h3>Details</h3><h2 id="section-2">Next</h2>'
        )
        const links = [...document.querySelectorAll(".contents-links a")]
        expect(links.map((link) => link.hash)).toEqual(["#existing", "#section-2-section", "#section-2"])
        expect(links[0].textContent).toBe("Rendering <pixels>")
        expect(links[0].children.length).toBe(0)
        expect(links[1].className).toBe("contents-subheading")
        expect(document.querySelector("[data-contents]").hidden).toBe(false)
    })
    it("keeps permalink symbols out of the contents labels", () => {
        setup(
            '<h2 id="prior-art"><span class="heading-title"><span class="marker-underline">Prior Art</span></span> <a class="heading-anchor" href="#prior-art">#</a></h2>'
        )
        expect(document.querySelector(".contents-links a").textContent).toBe("Prior Art")
    })
    it("collapses and expands without hiding the article", () => {
        setup("<h2>Section</h2><p>Read me</p>")
        const toggle = document.querySelector("button")
        toggle.click()
        expect(toggle.getAttribute("aria-expanded")).toBe("false")
        expect(toggle.getAttribute("aria-label")).toBe("Expand contents")
        expect(document.querySelector(".contents-links").hidden).toBe(true)
        expect(document.querySelector("article").hidden).toBe(false)
        toggle.click()
        expect(toggle.getAttribute("aria-expanded")).toBe("true")
    })
    it("tracks scroll in both directions and the bottom of the document", () => {
        let frame
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
            frame = callback
            return 1
        })
        let offset = 0
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
            return { top: Number(this.dataset.top) - offset }
        })
        setup('<h2 data-top="0" id="first">First</h2><h2 data-top="500" id="last">Last</h2>')
        const active = () => document.querySelector('[aria-current="location"]').hash
        expect(active()).toBe("#first")
        offset = 500
        window.dispatchEvent(new Event("scroll"))
        frame()
        expect(active()).toBe("#last")
        offset = 0
        window.dispatchEvent(new Event("scroll"))
        frame()
        expect(active()).toBe("#first")
        vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(2000)
        vi.spyOn(window, "scrollY", "get").mockReturnValue(2000 - window.innerHeight)
        window.dispatchEvent(new Event("scroll"))
        frame()
        expect(active()).toBe("#last")
    })
    it("shows plain empty contents and lets readers collapse and expand it", () => {
        setup("<p>A short post.</p>")
        expect(document.querySelector("[data-contents]").hidden).toBe(false)
        const list = document.querySelector(".contents-links")
        expect(list.querySelector("p.contents-empty").textContent).toBe("Nothing here.")
        expect(list.querySelector("a, button, [tabindex]")).toBeNull()
        const toggle = document.querySelector("button")
        toggle.click()
        expect(list.hidden).toBe(true)
        expect(toggle.getAttribute("aria-expanded")).toBe("false")
        toggle.click()
        expect(list.hidden).toBe(false)
        expect(toggle.getAttribute("aria-expanded")).toBe("true")
    })
})

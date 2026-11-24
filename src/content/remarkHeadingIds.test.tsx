import { renderToStaticMarkup } from "react-dom/server"
import Markdown from "react-markdown"
import { expect, it } from "vitest"
import { remarkHeadingIds } from "./remarkHeadingIds"

it("gives nested Markdown headings unique Unicode anchors without changing their content", () => {
    const html = renderToStaticMarkup(
        <Markdown remarkPlugins={[[remarkHeadingIds, { prefix: "status" }]]}>
            {"### Hello **world**\n\n### Hello world\n\n#### هویت\n\n###### Details"}
        </Markdown>
    )
    const doc = new DOMParser().parseFromString(html, "text/html")
    expect([...doc.querySelectorAll("h3,h4,h6")].map((heading) => heading.id)).toEqual([
        "status-hello-world",
        "status-hello-world-1",
        "status-هویت",
        "status-details",
    ])
    expect(doc.querySelector("h3 strong")?.textContent).toBe("world")
})

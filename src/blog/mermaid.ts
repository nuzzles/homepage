import mermaid from "mermaid"
import { setupDiagramViewer } from "./mermaid-viewer.ts"

const styles = getComputedStyle(document.documentElement)
const token = (name: string) => styles.getPropertyValue(name).trim()

mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    suppressErrorRendering: true,
    theme: "base",
    fontFamily: token("--font-body"),
    themeVariables: {
        fontSize: "16px",
        primaryColor: token("--card"),
        primaryTextColor: token("--foreground"),
        primaryBorderColor: token("--input-border"),
        lineColor: token("--muted-foreground"),
        secondaryColor: token("--muted"),
        tertiaryColor: token("--background"),
        edgeLabelBackground: token("--background"),
    },
    flowchart: { htmlLabels: false, curve: "linear", nodeSpacing: 24, rankSpacing: 28, wrappingWidth: 240 },
})

async function renderDiagram(figure: HTMLElement, index: number) {
    const diagram = figure.querySelector<HTMLElement>("[data-mermaid-diagram]")
    const status = figure.querySelector<HTMLElement>("[data-mermaid-status]")
    if (!diagram || !status) return

    status.textContent = "Loading diagram…"
    status.hidden = false
    diagram.setAttribute("aria-busy", "true")

    try {
        const source = new URL(figure.dataset.mermaidFile ?? "", window.location.href)
        if (source.origin !== window.location.origin || !source.pathname.endsWith(".mermaid")) {
            throw new Error("Expected a local .mermaid file")
        }
        const response = await fetch(source)
        if (!response.ok) throw new Error(`Diagram request failed (${response.status})`)
        const definition = await response.text()
        await document.fonts.ready
        const { svg } = await mermaid.render(`blog-mermaid-${index}`, definition)
        diagram.innerHTML = svg

        const element = diagram.querySelector("svg")
        if (element) {
            if (!element.hasAttribute("aria-labelledby")) {
                element.setAttribute("aria-label", figure.querySelector(".mermaid-title")?.textContent ?? "Diagram")
            }
            setupDiagramViewer(figure, element, index)
        }
        status.hidden = true
    } catch (error) {
        diagram.replaceChildren()
        status.textContent = "This diagram could not be displayed."
        console.error("Unable to render Mermaid diagram:", error)
    } finally {
        diagram.removeAttribute("aria-busy")
    }
}

document.querySelectorAll<HTMLElement>("[data-mermaid-file]").forEach((figure, index) => {
    void renderDiagram(figure, index)
})

export function setupDiagramViewer(figure: HTMLElement, svg: SVGSVGElement, index: number) {
    const viewport = figure.querySelector<HTMLElement>(".mermaid-viewport")
    const controls = figure.querySelector<HTMLElement>(".mermaid-controls")
    const zoomLabel = figure.querySelector<HTMLOutputElement>("[data-mermaid-zoom]")
    if (!viewport || !controls || !zoomLabel) return

    const { x, y, width, height } = svg.viewBox.baseVal
    if (!(width > 0 && height > 0)) return

    const bounds = { x, y, width, height }
    let centerX = x + width / 2
    let centerY = y + height / 2
    let scale = 1
    let fitted = true
    let drag: { id: number; x: number; y: number } | undefined
    const buttons = controls.querySelectorAll<HTMLButtonElement>("button")

    svg.removeAttribute("style")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "100%")
    viewport.id = `blog-mermaid-viewport-${index}`
    viewport.classList.add("is-interactive")
    viewport.style.setProperty("--mermaid-height", `${Math.min(600, Math.max(300, height + 32))}px`)
    viewport.setAttribute("aria-keyshortcuts", "+ - 0 F ArrowLeft ArrowRight ArrowUp ArrowDown")
    buttons.forEach((button) => button.setAttribute("aria-controls", viewport.id))
    controls.hidden = false

    const fitScale = () =>
        Math.min((viewport.clientWidth - 32) / bounds.width, (viewport.clientHeight - 32) / bounds.height, 1)
    const minScale = () => Math.min(fitScale(), 0.25)

    function draw() {
        const viewWidth = viewport!.clientWidth / scale
        const viewHeight = viewport!.clientHeight / scale
        svg.setAttribute("viewBox", `${centerX - viewWidth / 2} ${centerY - viewHeight / 2} ${viewWidth} ${viewHeight}`)
        zoomLabel!.value = `${Math.round(scale * 100)}%`
        buttons.forEach((button) => {
            button.disabled =
                (button.dataset.mermaidAction === "out" && scale <= minScale() + 0.0001) ||
                (button.dataset.mermaidAction === "in" && scale >= 4)
        })
    }

    function center(nextScale: number, fit: boolean) {
        centerX = bounds.x + bounds.width / 2
        centerY = bounds.y + bounds.height / 2
        fitted = fit
        scale = nextScale
        draw()
    }

    function zoom(factor: number, offsetX = 0, offsetY = 0) {
        const nextScale = Math.max(minScale(), Math.min(4, scale * factor))
        centerX += offsetX / scale - offsetX / nextScale
        centerY += offsetY / scale - offsetY / nextScale
        scale = nextScale
        fitted = false
        draw()
    }

    controls.addEventListener("click", (event) => {
        const action = (event.target as Element).closest<HTMLButtonElement>("button")?.dataset.mermaidAction
        if (action === "in") zoom(1.25)
        if (action === "out") zoom(1 / 1.25)
        if (action === "fit") center(fitScale(), true)
        if (action === "reset") center(1, false)
    })

    viewport.addEventListener(
        "wheel",
        (event) => {
            if (!event.ctrlKey && !event.metaKey) return
            event.preventDefault()
            const rect = viewport.getBoundingClientRect()
            const delta =
                event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1)
            zoom(
                Math.exp(-Math.max(-200, Math.min(200, delta)) * 0.005),
                event.clientX - rect.left - viewport.clientWidth / 2,
                event.clientY - rect.top - viewport.clientHeight / 2
            )
        },
        { passive: false }
    )

    viewport.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || !event.isPrimary) return
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY }
        viewport.setPointerCapture(event.pointerId)
        viewport.focus({ preventScroll: true })
        viewport.classList.add("is-dragging")
    })
    viewport.addEventListener("pointermove", (event) => {
        if (!drag || drag.id !== event.pointerId) return
        centerX -= (event.clientX - drag.x) / scale
        centerY -= (event.clientY - drag.y) / scale
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY }
        fitted = false
        draw()
    })
    const stopDrag = () => {
        drag = undefined
        viewport.classList.remove("is-dragging")
    }
    viewport.addEventListener("lostpointercapture", stopDrag)
    viewport.addEventListener("pointercancel", stopDrag)
    viewport.addEventListener("pointerup", (event) => {
        if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
        stopDrag()
    })

    viewport.addEventListener("keydown", (event) => {
        if (event.target !== viewport || event.ctrlKey || event.metaKey || event.altKey) return
        switch (event.key) {
            case "+":
            case "=":
                zoom(1.25)
                break
            case "-":
                zoom(1 / 1.25)
                break
            case "0":
                center(1, false)
                break
            case "f":
            case "F":
                center(fitScale(), true)
                break
            case "ArrowLeft":
                centerX -= 40 / scale
                fitted = false
                draw()
                break
            case "ArrowRight":
                centerX += 40 / scale
                fitted = false
                draw()
                break
            case "ArrowUp":
                centerY -= 40 / scale
                fitted = false
                draw()
                break
            case "ArrowDown":
                centerY += 40 / scale
                fitted = false
                draw()
                break
            default:
                return
        }
        event.preventDefault()
    })

    new ResizeObserver(() => {
        if (fitted) center(fitScale(), true)
        else draw()
    }).observe(viewport)
    center(fitScale(), true)
}

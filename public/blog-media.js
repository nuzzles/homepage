import { lockScroll } from "./blog-scroll.js"

function setupImages() {
    const images = document.querySelectorAll(".post-content img")
    if (!images.length || typeof HTMLDialogElement === "undefined") return

    const dialog = document.createElement("dialog")
    dialog.className = "image-viewer"
    dialog.setAttribute("aria-label", "Enlarged image")
    const toolbar = document.createElement("div")
    toolbar.className = "image-viewer-toolbar"
    const close = document.createElement("button")
    close.type = "button"
    close.textContent = "×"
    close.className = "image-viewer-close"
    close.setAttribute("aria-label", "Close enlarged image")
    const zoom = document.createElement("button")
    zoom.type = "button"
    zoom.textContent = "Zoom in"
    zoom.setAttribute("aria-pressed", "false")
    const viewport = document.createElement("div")
    viewport.className = "image-viewer-viewport"
    viewport.tabIndex = 0
    viewport.setAttribute("role", "region")
    viewport.setAttribute("aria-label", "Image; scroll to pan when zoomed")
    const enlarged = document.createElement("img")
    enlarged.draggable = false
    viewport.append(enlarged)
    toolbar.append(zoom, close)
    dialog.append(toolbar, viewport)
    document.body.append(dialog)
    let trigger, unlock

    const setZoom = (zoomed) => {
        dialog.classList.toggle("is-zoomed", zoomed)
        zoom.textContent = zoomed ? "Zoom out" : "Zoom in"
        zoom.setAttribute("aria-pressed", String(zoomed))
        viewport.scrollTo(0, 0)
    }
    const toggleZoom = () => setZoom(!dialog.classList.contains("is-zoomed"))
    enlarged.addEventListener("click", toggleZoom)
    zoom.addEventListener("click", toggleZoom)
    close.addEventListener("click", () => dialog.close())
    // Only an actual outside tap closes; finishing a pan outside the image does not.
    const isBackdrop = (target) => target !== enlarged && !toolbar.contains(target)
    let outsideDown = false
    dialog.addEventListener("pointerdown", (event) => {
        outsideDown = isBackdrop(event.target)
    })
    dialog.addEventListener("click", (event) => {
        if (outsideDown && isBackdrop(event.target)) dialog.close()
        outsideDown = false
    })
    dialog.addEventListener("close", () => {
        unlock?.()
        unlock = null
        trigger?.focus({ preventScroll: true })
        enlarged.removeAttribute("src")
    })

    for (const img of images) {
        const link = img.closest("a")
        // Image links can open their full-size source; navigation links must keep working.
        if (link && !/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(new URL(link.href).pathname)) continue
        if (img.closest("button, [role='button']")) continue
        const control = link || img
        img.classList.add("enlargeable-image")
        control.setAttribute("aria-haspopup", "dialog")
        if (!link) {
            img.tabIndex = 0
            img.setAttribute("role", "button")
            img.setAttribute("aria-label", `Enlarge image${img.alt ? `: ${img.alt}` : ""}`)
        }
        const open = (event) => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || dialog.open) return
            event.preventDefault()
            trigger = control
            enlarged.src = link?.href || img.currentSrc || img.src
            enlarged.alt = img.alt
            setZoom(false)
            unlock = lockScroll()
            dialog.showModal()
            close.focus({ preventScroll: true })
        }
        control.addEventListener("click", (event) => {
            if (event.target === img || event.target === control) open(event)
        })
        control.addEventListener("keydown", (event) => {
            if (event.key === " " || (!link && event.key === "Enter")) open(event)
        })
    }
}

setupImages()

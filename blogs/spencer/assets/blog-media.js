// Keep the reading position steady, including in mobile Safari.
function lockScroll() {
    const { scrollX, scrollY } = window
    const style = document.body.getAttribute("style")
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = `-${scrollX}px`
    document.body.style.width = "100%"
    return () => {
        if (style === null) document.body.removeAttribute("style")
        else document.body.setAttribute("style", style)
        window.scrollTo(scrollX, scrollY)
    }
}

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
    const viewport = document.createElement("div")
    viewport.className = "image-viewer-viewport"
    viewport.tabIndex = 0
    viewport.setAttribute("role", "region")
    viewport.setAttribute("aria-label", "Image; scroll to pan when zoomed")
    const enlarged = document.createElement("img")
    enlarged.draggable = false
    viewport.append(enlarged)
    toolbar.append(close)
    dialog.append(toolbar, viewport)
    document.body.append(dialog)
    let trigger, unlock

    const setZoom = (zoomed) => {
        dialog.classList.toggle("is-zoomed", zoomed)
        viewport.scrollTo(0, 0)
    }
    const toggleZoom = () => setZoom(!dialog.classList.contains("is-zoomed"))
    enlarged.addEventListener("click", toggleZoom)
    close.addEventListener("click", () => dialog.close())
    // Only an actual outside tap closes; finishing a pan outside the image does not.
    const isBackdrop = (target) => target !== enlarged && !close.contains(target)
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
            enlarged.src = img.currentSrc || img.src
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

function setupReplay(player) {
    const button = player.querySelector(".replay-expand")
    const frame = player.querySelector("iframe")
    let expanded = false,
        nativeFullscreen = false,
        unlock
    button.hidden = false

    const collapse = () => {
        if (!expanded) return
        expanded = false
        nativeFullscreen = false
        player.classList.remove("is-expanded")
        button.setAttribute("aria-expanded", "false")
        button.setAttribute("aria-label", "Expand replay")
        button.title = "Expand replay"
        unlock?.()
        unlock = null
        button.focus({ preventScroll: true })
        if (document.fullscreenElement === player) document.exitFullscreen().catch(() => {})
    }
    button.addEventListener("click", () => {
        if (expanded) return collapse()
        expanded = true
        unlock = lockScroll()
        player.classList.add("is-expanded")
        button.setAttribute("aria-expanded", "true")
        button.setAttribute("aria-label", "Collapse replay")
        button.title = "Collapse replay"
        button.focus({ preventScroll: true })
        // The fixed viewport remains usable when iPhone Safari has no Fullscreen API.
        if (document.fullscreenEnabled && player.requestFullscreen) player.requestFullscreen().catch(() => {})
    })
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement === player) nativeFullscreen = true
        else if (nativeFullscreen) collapse()
    })
    document.addEventListener("keydown", (event) => {
        if (expanded && event.key === "Escape") collapse()
    })
    document.addEventListener("focusin", (event) => {
        if (expanded && !player.contains(event.target)) button.focus({ preventScroll: true })
    })
    window.addEventListener("message", (event) => {
        // The sandbox has an opaque origin; authenticate using its exact window.
        if (event.source === frame.contentWindow && event.data?.type === "motion-replay:escape") collapse()
    })
}

setupImages()
document.querySelectorAll("[data-replay-player]").forEach(setupReplay)

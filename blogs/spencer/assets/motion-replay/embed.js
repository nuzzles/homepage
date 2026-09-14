import { lockScroll } from "/blog-scroll.js"

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

document.querySelectorAll("[data-replay-player]").forEach(setupReplay)

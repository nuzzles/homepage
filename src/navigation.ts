// React Router handles app routes. Hugo links still need a document navigation.
const prefetched = new Set<string>()

function destination(event: Event) {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
    if (
        !(link instanceof HTMLAnchorElement) ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
    )
        return
    const url = new URL(link.href)
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return
    url.hash = ""
    return { link, url }
}

function prefetch(event: Event) {
    const target = destination(event)
    if (!target || !target.link.closest(".site-navigation, .footer-links") || prefetched.has(target.url.href)) return
    prefetched.add(target.url.href)
    const hint = document.createElement("link")
    hint.rel = "prefetch"
    hint.href = target.url.href
    hint.as = "document"
    document.head.append(hint)
}

document.addEventListener("pointerover", prefetch, { passive: true })
document.addEventListener("focusin", prefetch)
document.addEventListener("touchstart", prefetch, { passive: true })
document.addEventListener("click", (event) => {
    // Router links prevent the native navigation before this document listener runs.
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    )
        return
    if (destination(event)) document.documentElement.dataset.navigating = "true"
})

const reset = () => delete document.documentElement.dataset.navigating
window.addEventListener("pageshow", reset)
window.addEventListener("pagehide", reset)

function passContent(frame) {
    const text = frame.closest(".hex-viewer-figure").querySelector("template[data-hex-text]").content.textContent
    frame.contentWindow.postMessage({ type: "hex-viewer:content", text, title: frame.title }, window.location.origin)
}

window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return
    for (const frame of document.querySelectorAll("iframe[data-hex-viewer]")) {
        if (frame.contentWindow !== event.source) continue
        if (event.data?.type === "hex-viewer:ready") passContent(frame)
        if (event.data?.type === "hex-viewer:resize") {
            const height = event.data.height
            if (Number.isFinite(height) && height >= 300 && height <= 2000) {
                frame.style.height = `${Math.ceil(height)}px`
            }
        }
    }
})

for (const frame of document.querySelectorAll("iframe[data-hex-viewer]")) {
    frame.addEventListener("load", () => passContent(frame))
    passContent(frame)
}

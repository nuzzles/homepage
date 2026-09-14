// Keep the reading position steady, including in mobile Safari.
export function lockScroll() {
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

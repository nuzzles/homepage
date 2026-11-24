import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"

/** Start new pages at the top, or restore their requested fragment after mounting. */
export const usePageAnchor = () => {
    const { pathname, hash, key } = useLocation()
    useLayoutEffect(() => {
        if (hash) {
            let id = hash.slice(1)
            try {
                id = decodeURIComponent(id)
            } catch {
                /* Preserve malformed literal fragments. */
            }
            document.getElementById(id)?.scrollIntoView()
        } else (document.scrollingElement ?? document.documentElement).scrollTop = 0
    }, [pathname, hash, key])
}

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** Start new pages at the top, or restore their requested fragment after mounting. */
export const usePageAnchor = () => {
    const { pathname, hash } = useLocation()
    useEffect(() => {
        if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
        else (document.scrollingElement ?? document.documentElement).scrollTop = 0
    }, [pathname, hash])
}

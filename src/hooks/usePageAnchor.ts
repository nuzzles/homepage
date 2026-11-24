import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** Restore fragment navigation after React mounts a page's sections. */
export const usePageAnchor = () => {
    const { pathname, hash } = useLocation()
    useEffect(() => {
        if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    }, [pathname, hash])
}

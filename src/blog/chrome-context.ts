import { createContext } from "react"

// Hugo supplies its resolved site URLs; React pages use the route-aware defaults.
export interface BlogChromeLocation {
    homepageURL: string
    blogURL: string
}
export const BlogChromeContext = createContext<BlogChromeLocation | null>(null)

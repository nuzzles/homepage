import { act } from "react"
import { hydrateRoot } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { BlogChrome, type BlogChromeProps } from "./chrome"
import { renderBlogChrome } from "./chrome-server"

// React's test environment flag also covers effects triggered during hydration.
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
afterEach(() => document.body.replaceChildren())

describe("shared blog chrome", () => {
    it.each(["http://localhost:5173/spencer", "https://spencer.imbleau.com"])(
        "hydrates %s without replacing its static navigation",
        async (homepageURL) => {
            for (const section of ["header", "footer"] as const) {
                const props: BlogChromeProps = {
                    section,
                    homepageURL,
                    blogURL: `${homepageURL}/blog/`,
                }
                const container = document.createElement("div")
                container.innerHTML = renderBlogChrome(props)
                document.body.append(container)
                const navigation = container.querySelector(section)
                const onRecoverableError = vi.fn()
                let root: ReturnType<typeof hydrateRoot>
                await act(async () => {
                    root = hydrateRoot(container, <BlogChrome {...props} />, {
                        identifierPrefix: `blog-${section}-`,
                        onRecoverableError,
                    })
                })
                expect(onRecoverableError).not.toHaveBeenCalled()
                expect(container.querySelector(section)).toBe(navigation)
                const links = [...container.querySelectorAll("a")]
                expect(links.some((link) => link.href === new URL(homepageURL).href)).toBe(true)
                expect(links.some((link) => link.textContent === "About")).toBe(true)
                expect(links.some((link) => link.href.includes("/sara"))).toBe(false)
                await act(async () => root.unmount())
            }
        }
    )
})

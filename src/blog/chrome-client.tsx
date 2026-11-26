import { createRoot, hydrateRoot } from "react-dom/client"
import { BlogChrome, type BlogChromeProps } from "./chrome"
import { StatsInteractions } from "./StatsInteractions"
import "../index.css"
import "../navigation"

for (const element of document.querySelectorAll<HTMLElement>("[data-blog-chrome]")) {
    const { homepageUrl, blogUrl, blogChrome: section } = element.dataset
    if (!homepageUrl || !blogUrl || (section !== "header" && section !== "footer")) continue
    const props: BlogChromeProps = { homepageURL: homepageUrl, blogURL: blogUrl, section }
    hydrateRoot(element, <BlogChrome {...props} />, { identifierPrefix: `blog-${section}-` })
}

const statsRoot = document.querySelector("[data-stats-interactions]")
if (statsRoot) createRoot(statsRoot).render(<StatsInteractions />)

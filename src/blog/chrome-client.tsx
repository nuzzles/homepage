import { hydrateRoot } from "react-dom/client"
import { BlogChrome, type BlogChromeProps } from "./chrome"
import "../index.css"

for (const element of document.querySelectorAll<HTMLElement>("[data-blog-chrome]")) {
    const { homepageUrl, blogUrl, blogChrome: section } = element.dataset
    if (!homepageUrl || !blogUrl || (section !== "header" && section !== "footer")) continue
    const props: BlogChromeProps = { homepageURL: homepageUrl, blogURL: blogUrl, section }
    hydrateRoot(element, <BlogChrome {...props} />, { identifierPrefix: `blog-${section}-` })
}

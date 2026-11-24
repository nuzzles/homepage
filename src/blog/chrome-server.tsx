import { renderToString } from "react-dom/server"
import { BlogChrome, type BlogChromeProps } from "./chrome"

export function renderBlogChrome(props: BlogChromeProps) {
    return renderToString(<BlogChrome {...props} />, { identifierPrefix: `blog-${props.section}-` })
}

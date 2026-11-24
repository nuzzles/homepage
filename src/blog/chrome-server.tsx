import { renderToString, renderToStaticMarkup } from "react-dom/server"
import { BlogChrome, type BlogChromeProps } from "./chrome"
import { ContentsHeader } from "@/components/ContentsHeader"
import en from "@/i18n/locales/en.json"

export function renderBlogChrome(props: BlogChromeProps) {
    return renderToString(<BlogChrome {...props} />, { identifierPrefix: `blog-${props.section}-` })
}

// Hugo and React reading pages use the same Contents heading and disclosure button.

export function renderBlogContentsHeader() {
    return renderToStaticMarkup(<ContentsHeader labels={en.contents} controlsId="post-contents-links" />)
}

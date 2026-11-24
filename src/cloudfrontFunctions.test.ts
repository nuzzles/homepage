import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInNewContext } from "node:vm"
import { describe, expect, it } from "vitest"

type CloudFrontRequest = {
    uri: string
}

type CloudFrontResponse = {
    statusCode: number
    headers: {
        location: { value: string }
    }
}

const loadFunction = (name: string) => readFileSync(resolve("terraform/functions", name), "utf8")

const runFunction = (source: string, uri: string) =>
    runInNewContext(`${source}\nhandler(event)`, {
        event: { request: { uri } },
    }) as CloudFrontRequest | CloudFrontResponse

describe("CloudFront request routing", () => {
    const blogRouter = loadFunction("blog-router.js")
        .replace("${blog_base_path}", JSON.stringify("/blog"))
        .replace("${about_redirect}", JSON.stringify("/about"))
    const spaRouter = loadFunction("spa-router.js")

    it.each(["/blog/about", "/blog/about/", "/blog/about/index.html", "/blog/about.html"])(
        "redirects Spencer's old About URL %s",
        (uri) => {
            expect(runFunction(blogRouter, uri)).toMatchObject({
                statusCode: 308,
                headers: { location: { value: "/about" } },
            })
        }
    )
    it("preserves Sara's blog About page", () => {
        const saraRouter = loadFunction("blog-router.js")
            .replace("${blog_base_path}", JSON.stringify("/blog"))
            .replace("${about_redirect}", JSON.stringify(""))
        expect(runFunction(saraRouter, "/blog/about/")).toMatchObject({ uri: "/blog/about/index.html" })
    })

    it("redirects the blog root to its canonical trailing-slash URL", () => {
        expect(runFunction(blogRouter, "/blog")).toMatchObject({
            statusCode: 308,
            headers: { location: { value: "/blog/" } },
        })
    })

    it.each(["/blog/", "/blog/archive/"])("resolves the Jekyll directory URL %s", (uri) => {
        expect(runFunction(blogRouter, uri)).toMatchObject({ uri: `${uri}index.html` })
    })

    it("leaves blog files and unrelated URLs unchanged", () => {
        expect(runFunction(blogRouter, "/blog/feed.xml")).toMatchObject({ uri: "/blog/feed.xml" })
        expect(runFunction(blogRouter, "/images/me.webp")).toMatchObject({ uri: "/images/me.webp" })
    })

    it.each([
        "/resume",
        ...["", "/en", "/fr", "/fa"].flatMap((prefix) => [`${prefix}/about`, `${prefix}/about/`]),
        "/en",
        "/fr/resume/",
        "/fa/",
        "/how-i-work",
        "/how-i-work/",
        ...["en", "fr", "fa"].flatMap((lang) => [`/${lang}/how-i-work`, `/${lang}/how-i-work/`]),
    ])("resolves the SPA route %s", (uri) => {
        expect(runFunction(spaRouter, uri)).toMatchObject({ uri: "/index.html" })
    })

    it("leaves unknown routes unchanged so CloudFront can return a real 404", () => {
        expect(runFunction(spaRouter, "/missing")).toMatchObject({ uri: "/missing" })
        expect(runFunction(spaRouter, "/how-i-work/missing")).toMatchObject({ uri: "/how-i-work/missing" })
    })
})

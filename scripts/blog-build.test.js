import { spawnSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { JSDOM } from "jsdom"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { renderBlogChrome } from "../src/blog/chrome-server"
import { hugoBinary } from "./setup-hugo.mjs"

const root = resolve(import.meta.dirname, "..")
const temp = mkdtempSync(join(tmpdir(), "homepage-hugo-test-"))
const output = join(temp, "public")
const legacyPaths = [
    "2021/05/30/hello-world.html",
    "rust/graphics/2022/06/19/nvidia-gpu-profiling-with-rust.html",
    "rust/graphics/2023/11/20/using-vello-for-video-games.html",
    "rust/graphics/2024/08/01/press-bevy_vello.html",
    "ai/2026/09/07/ai-is-still-in-its-homelab-era.html",
    "ai/rust/2026/09/14/halo-infinite-theater-format-astra.html",
]
const html = (path) => new JSDOM(readFileSync(join(output, path), "utf8")).window.document
function build(extra = []) {
    const result = spawnSync(
        process.env.HUGO_BINARY ?? hugoBinary,
        [
            "--source",
            temp,
            "--destination",
            output,
            "--config",
            [join(root, "blog/hugo.json"), join(temp, "runtime.json")].join(","),
            "--clock",
            "2026-11-24T00:00:00Z",
            "--cacheDir",
            join(temp, "cache"),
            ...extra,
        ],
        { encoding: "utf8" }
    )
    if (result.error || result.status !== 0)
        throw new Error(`${result.error ?? ""}\n${result.stdout}\n${result.stderr}`)
}
beforeAll(() => {
    cpSync(join(root, "blog/content"), join(temp, "content"), { recursive: true })
    cpSync(join(root, "blog/data"), join(temp, "data"), { recursive: true })
    mkdirSync(join(temp, "assets"))
    writeFileSync(
        join(temp, "runtime.json"),
        JSON.stringify({
            layoutDir: join(root, "blog/layouts"),
            params: {
                homepageURL: "https://spencer.imbleau.com",
                blogURL: "https://spencer.imbleau.com/blog/",
                chromeHeader: renderBlogChrome({
                    homepageURL: "https://spencer.imbleau.com",
                    blogURL: "https://spencer.imbleau.com/blog/",
                    section: "header",
                }),
                chromeFooter: renderBlogChrome({
                    homepageURL: "https://spencer.imbleau.com",
                    blogURL: "https://spencer.imbleau.com/blog/",
                    section: "footer",
                }),
                chromeScript: "/assets/chrome.js",
                chromeStylesheets: ["/assets/site.css"],
                aboutURL: "https://spencer.imbleau.com/about",
                fullName: "Spencer Imbleau",
                firstName: "Spencer",
                themeStylesheet: "/blog-theme.css",
                mediaStylesheet: "/blog-media.css",
                mermaidScript: "/assets/mermaid/embed.js",
                postStylesheets: {},
            },
        })
    )
    writeFileSync(
        join(temp, "content/posts/draft.md"),
        "---\ntitle: Unpublished test\ndate: 2026-11-20\ndraft: true\nurl: unpublished/\n---\nPrivate draft body.\n"
    )
    writeFileSync(
        join(temp, "content/posts/future.md"),
        "---\ntitle: Scheduled test\ndate: 2099-01-01\nurl: scheduled/\n---\nFuture post.\n"
    )
    build()
})
afterAll(() => rmSync(temp, { recursive: true, force: true }))

describe("Hugo migration", () => {
    it("renders collapsible empty contents before JavaScript runs", () => {
        const contents = html(legacyPaths[0]).querySelector("[data-contents]")
        expect(contents.hidden).toBe(false)
        expect(contents.querySelector(".contents-heading p").textContent).toBe("Contents")
        expect(contents.querySelector(".contents-empty").textContent).toBe("Nothing here.")
        expect(contents.querySelector(".contents-links a")).toBeNull()
        expect(contents.querySelector("button").getAttribute("aria-controls")).toBe("post-contents-links")
    })
    it("ships shared header and footer navigation in archive and article HTML before JavaScript runs", () => {
        for (const path of ["index.html", legacyPaths[0]]) {
            const doc = html(path)
            expect(doc.querySelector("header .profile-brand").href).toBe("https://spencer.imbleau.com/")
            expect([...doc.querySelectorAll(".site-navigation nav a")].map((a) => a.textContent)).toEqual([
                "Blog",
                "About",
            ])
            expect(doc.querySelector('.site-navigation [aria-current="page"]').textContent).toBe("Blog")
            expect([...doc.querySelectorAll("footer .footer-links a")].map((a) => a.textContent)).toEqual([
                "Blog",
                "About",
                "Resume",
            ])
            expect(doc.querySelector("footer .social-strip").textContent).toContain("GitHub")
            expect(doc.querySelector('footer [aria-label="coffee"]')).not.toBeNull()
            expect(doc.querySelector('footer img[alt="Claude"]')).not.toBeNull()
            expect(doc.querySelector('script[src="/assets/chrome.js"]')).not.toBeNull()
            expect(doc.querySelector('link[href="/assets/site.css"]')).not.toBeNull()
        }
    })
    it("preserves every published URL, canonical URL, heading link, and article schema", () => {
        for (const path of legacyPaths) {
            const doc = html(path)
            expect(doc.querySelector('link[rel="canonical"]').href).toBe(`https://spencer.imbleau.com/blog/${path}`)
            const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)
            expect(schema.author.name).toBe("Spencer Imbleau")
            expect(schema.headline).toBe(doc.querySelector("h1").textContent)
            for (const link of doc.querySelectorAll('.post-content a[href^="#"], .contents-links a')) {
                expect(
                    doc.getElementById(decodeURIComponent(link.hash.slice(1))),
                    `${path}: ${link.hash}`
                ).not.toBeNull()
            }
        }
    })
    it("groups all posts by year and preserves categories, RSS, and the published feed", () => {
        const archive = html("index.html")
        expect([...archive.querySelectorAll(".archive-year h2")].map((h) => h.textContent)).toEqual([
            "2026",
            "2024",
            "2023",
            "2022",
            "2021",
        ])
        expect(archive.querySelectorAll(".archive-posts li")).toHaveLength(6)
        expect(html("categories.html").querySelectorAll(".category-group")).toHaveLength(3)
        const latest = JSON.parse(readFileSync(join(output, "latest.json"), "utf8"))
        expect(latest).toHaveLength(3)
        expect(latest[0].description).toContain("Infinite's")
        const rss = new JSDOM(readFileSync(join(output, "feed.xml"), "utf8"), { contentType: "text/xml" }).window
            .document
        expect(rss.querySelectorAll("item")).toHaveLength(6)
        expect(readFileSync(join(output, "sitemap.xml"), "utf8")).not.toContain("/posts/")
        expect(html("about/index.html").querySelector('link[rel="canonical"]').href).toBe(
            "https://spencer.imbleau.com/about"
        )
    })
    it("keeps five chronological neighbours, filling the window at either end", () => {
        for (const index of [0, 2, 3, 5]) {
            const timeline = html(legacyPaths[index]).querySelector(".post-timeline")
            expect(timeline.querySelectorAll("li")).toHaveLength(5)
            expect(timeline.querySelectorAll('[aria-current="page"]')).toHaveLength(1)
            const dates = [...timeline.querySelectorAll("time")].map((t) => t.dateTime)
            expect(dates).toEqual([...dates].sort())
            expect(timeline.dataset.hasOlder).toBe(String(dates[0] !== "2021-05-30"))
            expect(timeline.dataset.hasNewer).toBe(String(dates.at(-1) !== "2026-09-14"))
        }
    })
    it("labels Opinion posts with a notice and slash-separated reading metadata", () => {
        const opinion = html(legacyPaths[4])
        expect(opinion.querySelector(".opinion-notice").textContent).toBe("Thinking out loud")
        expect(opinion.querySelector(".post-meta").textContent).toMatch(/September 7, 2026\/\d+ minute read\/Opinion/)
        expect(opinion.querySelectorAll(".meta-separator")).toHaveLength(2)
        const regular = html(legacyPaths[0])
        expect(regular.querySelector(".opinion-notice")).toBeNull()
        expect(regular.querySelector(".post-meta").textContent).not.toContain("Opinion")
        expect(regular.querySelectorAll(".meta-separator")).toHaveLength(1)
    })
    it("badges Opinion titles in archives and exposes the label to homepage listings", () => {
        const archive = html("index.html")
        const badge = archive.querySelector(".opinion-badge")
        expect(archive.querySelectorAll(".opinion-badge")).toHaveLength(1)
        expect(badge.textContent).toBe("Thinking out loud")
        expect(badge.closest("h3").querySelector("a").getAttribute("href")).toContain(legacyPaths[4])
        const latest = JSON.parse(readFileSync(join(output, "latest.json"), "utf8"))
        expect(latest.filter((post) => post.opinion).map((post) => post.title)).toEqual(["AI is in its homelab era"])
    })
    it("links sidebar tags to populated archive sections", () => {
        const index = html("tags/index.html")
        const post = html(legacyPaths[4])
        const tags = [...post.querySelectorAll(".post-tags a")]
        expect(tags.map((tag) => tag.textContent)).toEqual(["#ai", "#opinion"])
        for (const tag of tags) {
            const href = new URL(tag.getAttribute("href"), "https://spencer.imbleau.com")
            expect(href.pathname).toBe("/blog/tags/")
            const group = index.getElementById(href.hash.slice(1)).closest("section")
            expect([...group.querySelectorAll("a")].some((a) => a.getAttribute("href").endsWith(legacyPaths[4]))).toBe(
                true
            )
        }
        expect(html(legacyPaths[1]).querySelector(".post-tags").textContent).toContain("#rust")
    })
    it("retains replay, hex, Mermaid, video, citations, and sandbox markup", () => {
        const article = html(legacyPaths[5])
        expect(article.querySelector("[data-replay-player] iframe").getAttribute("sandbox")).toBe("allow-scripts")
        expect(article.querySelector("[data-replay-player] iframe").getAttribute("src")).toContain(
            "/blog/assets/motion-replay/octagon.html#start=146.2"
        )
        expect(article.querySelector("[data-hex-text]").content.textContent).toContain("78 5E")
        expect(article.querySelectorAll("[data-mermaid-file]")).toHaveLength(2)
        expect(article.querySelector("video source").getAttribute("src")).toContain("/blog/assets/early-twin.webm")
        expect(html(legacyPaths[3]).querySelector(".post-content").textContent).toContain(
            "{{Compute-centric vector graphics using bevy_vello}}"
        )
    })
    it("excludes drafts and scheduled posts in production but previews them without leaking them into feeds", () => {
        expect(existsSync(join(output, "unpublished/index.html"))).toBe(false)
        expect(existsSync(join(output, "scheduled/index.html"))).toBe(false)
        build(["--buildDrafts", "--buildFuture"])
        expect(html("index.html").querySelectorAll(".archive-posts li")).toHaveLength(8)
        expect(html("unpublished/index.html").querySelector(".draft-marker").textContent).toBe("Draft")
        expect(readFileSync(join(output, "latest.json"), "utf8")).not.toMatch(/Unpublished|Scheduled/)
    })
})

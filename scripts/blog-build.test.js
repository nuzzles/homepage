import { spawnSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { JSDOM } from "jsdom"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { renderBlogChrome, renderBlogContentsHeader } from "../src/blog/chrome-server"
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
    for (const directory of ["hex-viewer", "motion-replay", "diagrams", "opengraph"]) {
        cpSync(join(root, "blog/assets", directory), join(temp, "assets", directory), { recursive: true })
    }
    writeFileSync(
        join(temp, "runtime.json"),
        JSON.stringify({
            layoutDir: join(root, "blog/layouts"),
            params: {
                notFoundHTML:
                    '<!doctype html><html data-site="spencer"><head><meta name="robots" content="noindex, follow"></head><body><div id="root"></div><script type="module" src="/assets/homepage.js"></script></body></html>',
                contentsHeader: renderBlogContentsHeader(),
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
    it("uses the translated site app for missing blog pages", () => {
        const page = html("404.html")
        expect(page.documentElement.dataset.site).toBe("spencer")
        expect(page.querySelector("#root")).not.toBeNull()
        expect(page.querySelector('script[src="/assets/homepage.js"]')).not.toBeNull()
        expect(page.querySelector('[data-blog-chrome="header"]')).toBeNull()
        expect(page.querySelector('meta[name="robots"]').content).toBe("noindex, follow")
    })
    it("renders collapsible empty contents before JavaScript runs", () => {
        const contents = html(legacyPaths[0]).querySelector("[data-contents]")
        expect(contents.hidden).toBe(false)
        expect(contents.querySelector(".contents-heading p").textContent).toBe("Contents")
        expect(contents.querySelector(".contents-empty").textContent).toBe("Nothing here.")
        expect(contents.querySelector(".contents-links a")).toBeNull()
        expect(contents.querySelector("button").getAttribute("aria-controls")).toBe("post-contents-links")
    })
    it("ships shared header and footer navigation in archive and article HTML before JavaScript runs", () => {
        for (const path of ["index.html", "stats/index.html", legacyPaths[0]]) {
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
                "How I work",
                "Blog stats",
                "Reading list",
                "Tags",
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
    it("renders heading permalinks and marker titles without polluting the contents", () => {
        for (const path of legacyPaths.slice(1)) {
            const doc = html(path)
            for (const heading of doc.querySelectorAll(".post-content :is(h1,h2,h3,h4,h5,h6)")) {
                const title = heading.querySelector(".heading-title")
                expect(title.querySelector(".marker-underline")).not.toBeNull()
                const anchor = heading.querySelector(".heading-anchor")
                expect(decodeURIComponent(anchor.hash.slice(1))).toBe(heading.id)
                expect(anchor.getAttribute("aria-label")).toBe(`Link to ${title.textContent}`)
                const tocLink = [...doc.querySelectorAll(".contents-links a")].find(
                    (a) => decodeURIComponent(a.hash.slice(1)) === heading.id
                )
                if (tocLink) expect(tocLink.textContent).toBe(title.textContent)
            }
        }
    })
    it("ships the actual replay and decompression documents with their local dependencies", () => {
        const doc = html(legacyPaths[5])
        for (const frame of doc.querySelectorAll(".motion-replay-player iframe, iframe[data-hex-viewer]")) {
            const path = new URL(frame.src, "https://spencer.imbleau.com").pathname.replace(/^\/blog\//, "")
            const embedded = html(path)
            expect(embedded.querySelector("script")).not.toBeNull()
            for (const resource of embedded.querySelectorAll("script[src], link[rel=stylesheet]")) {
                const relative = resource.getAttribute("src") ?? resource.getAttribute("href")
                const url = new URL(relative, new URL(frame.src, "https://spencer.imbleau.com"))
                if (url.origin === new URL(frame.src, "https://spencer.imbleau.com").origin) {
                    expect(existsSync(join(output, url.pathname.replace(/^\/blog\//, ""))), url.pathname).toBe(true)
                }
            }
        }
        expect(html("assets/hex-viewer/index.html").querySelector("#decoded-tab").textContent).toContain("Decompressed")
        expect(readFileSync(join(output, "assets/motion-replay/octagon.html"), "utf8")).toContain("<canvas")
    })
    it("groups all posts by year and preserves RSS and the published feed", () => {
        const archive = html("index.html")
        expect([...archive.querySelectorAll(".archive-year h2")].map((h) => h.textContent)).toEqual([
            "2026",
            "2024",
            "2023",
            "2022",
            "2021",
        ])
        expect(archive.querySelectorAll(".archive-posts li")).toHaveLength(6)
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
    it("redirects the redundant categories archive to tags without listing it in the sitemap", () => {
        const redirect = html("categories.html")
        expect(redirect.querySelector('link[rel="canonical"]').href).toBe("https://spencer.imbleau.com/blog/tags/")
        expect(redirect.querySelector('meta[http-equiv="refresh"]').content).toBe("0; url=/blog/tags/")
        expect(readFileSync(join(output, "sitemap.xml"), "utf8")).not.toContain("categories.html")
        const topics = [...html("tags/index.html").querySelectorAll(".archive-year-heading h2")].map(
            (h) => h.textContent
        )
        expect(topics).toEqual(expect.arrayContaining(["#ai", "#rust", "#graphics", "#opinion"]))
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
        expect(opinion.querySelector(".opinion-notice").textContent).toBe("OPINION")
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
        expect(badge.textContent).toBe("Opinion")
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
    it("derives stats from published posts, including empty years and leap days", () => {
        const stats = html("stats/index.html")
        expect(stats.querySelector('[data-stat="posts"]').textContent).toBe("6")
        expect(stats.querySelectorAll('.stats-calendar-full .stats-day[data-date^="2024-"]')).toHaveLength(366)
        expect([...stats.querySelectorAll(".stats-legend span")].map((item) => item.textContent)).toEqual([
            "No posts",
            "1+ posts",
        ])
        const calendar = stats.querySelector(".stats-calendar")
        expect([...calendar.querySelectorAll(".stats-weekday")].map((day) => day.textContent)).toEqual([
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
            "S",
        ])
        expect(calendar.querySelectorAll(".stats-month")).toHaveLength(12)
        expect(calendar.querySelector(".stats-month").textContent).toBe("January")
        expect(calendar.querySelector('[data-date="2026-01-01"]').getAttribute("y")).toBe("68")
        expect(calendar.querySelector('[data-date="2026-01-05"]').getAttribute("y")).toBe("26")
        expect(calendar.querySelector('[data-date="2026-09-14"]').classList.contains("has-posts")).toBe(true)
        const quarterDays = stats.querySelector(".stats-calendar-quarters").querySelectorAll("[data-date]")
        expect([...quarterDays].map((day) => day.dataset.date)).toEqual(
            [...calendar.querySelectorAll("[data-date]")].map((day) => day.dataset.date)
        )
        expect(stats.querySelector(".stats-calendar-quarters").querySelectorAll("svg")).toHaveLength(4)

        expect(stats.querySelectorAll('.stats-calendar-full .stats-day[data-date^="2025-"]')).toHaveLength(365)
        expect(stats.querySelector('[data-date="2021-05-30"]').getAttribute("data-count")).toBe("1")
        expect(stats.querySelector('[data-date="2026-09-14"]').getAttribute("data-count")).toBe("1")
        const rows = (id) =>
            [...stats.querySelectorAll(`#${id} ~ details table tbody tr`)].map((row) => Number(row.dataset.value))
        expect(rows("posts-per-year")).toEqual([1, 1, 1, 1, 0, 2])
        expect(rows("posts-per-month")).toHaveLength(24)
        expect(rows("posts-per-month").filter(Boolean)).toEqual([2])
        expect(stats.querySelector('#posts-per-month ~ details tr[data-period="December 2024"]').dataset.value).toBe(
            "0"
        )
        expect(stats.querySelector('#posts-per-month ~ details tr[data-period="November 2026"]').dataset.value).toBe(
            "0"
        )
        expect(stats.querySelector("#day-2026-09-14").content.querySelector("a").href).toContain(legacyPaths[5])
        expect(stats.querySelector(".stats-day-trigger")).not.toBeNull()
        const words = Number(stats.querySelector('[data-stat="words"]').textContent.replaceAll(",", ""))
        expect(words).toBeGreaterThan(1000)
        for (const row of stats.querySelectorAll(".stats-chart tbody tr")) {
            expect(Number(row.querySelector(".stats-value").textContent.replaceAll(",", ""))).toBe(
                Number(row.dataset.value)
            )
        }
        expect(rows("words-per-year").reduce((sum, count) => sum + count, 0)).toBe(words)
        expect(rows("words-per-month").reduce((sum, count) => sum + count, 0)).toBe(rows("words-per-year").at(-1))
        expect(stats.querySelector(".stats-bar").getAttribute("style")).toMatch(/--bar-height: [\d.]+%/)
        expect(stats.querySelector('a[href="https://spencer.imbleau.com/blog/stats/"]')).not.toBeNull()
        expect(stats.querySelector('a[href="https://spencer.imbleau.com/books"]')).not.toBeNull()
        expect(readFileSync(join(output, "sitemap.xml"), "utf8")).toContain("/blog/stats/")
    })
    it("excludes drafts and scheduled posts in production but previews them without leaking them into feeds", () => {
        expect(existsSync(join(output, "unpublished/index.html"))).toBe(false)
        expect(existsSync(join(output, "scheduled/index.html"))).toBe(false)
        const publishedStats = html("stats/index.html").querySelector(".blog-stats").textContent
        build(["--buildDrafts", "--buildFuture"])
        expect(html("stats/index.html").querySelector(".blog-stats").textContent).toBe(publishedStats)
        expect(html("index.html").querySelectorAll(".archive-posts li")).toHaveLength(8)
        expect(html("unpublished/index.html").querySelector(".draft-marker").textContent).toBe("Draft")
        expect(readFileSync(join(output, "latest.json"), "utf8")).not.toMatch(/Unpublished|Scheduled/)
    })
    it("lists every post when multiple posts share a calendar day", () => {
        writeFileSync(
            join(temp, "content/posts/same-day.md"),
            "---\ntitle: Another post\ndate: 2026-09-14\nurl: another-post/\n---\nAnother post body.\n"
        )
        build()
        const stats = html("stats/index.html")
        expect(stats.querySelector('[data-date="2026-09-14"]').dataset.count).toBe("2")
        expect(stats.querySelector("#day-2026-09-14").content.querySelectorAll("a")).toHaveLength(2)
    })
})

import { spawn } from "node:child_process"
import { createHash } from "node:crypto"
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { hugoBinary, setupHugo } from "./setup-hugo.mjs"
import { compactReplayData } from "./replay-assets.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const profiles = JSON.parse(readFileSync(join(root, "profiles.json"), "utf8"))
const command = process.argv[2]
const deploymentEnvironment = process.env.HOMEPAGE_ENVIRONMENT

const fail = (message) => {
    console.error(message)
    process.exit(1)
}

if (command !== "build" && command !== "dev") {
    fail("Usage: node scripts/blog.mjs <build|dev>")
}

const requestedSite = process.env.HOMEPAGE_SITE
const spencer = profiles.spencer
const source = join(root, "blog")
const output = join(root, "dist/blog")
const devDirectory = join(root, "node_modules/.cache/hugo-dev")

const run = (executable, args, options = {}) =>
    spawn(executable, args, {
        cwd: root,
        env: process.env,
        stdio: "inherit",
        ...options,
    })

// Sara and the selector deploy only the React site; neither owns a blog.
if ((command === "build" && requestedSite !== "spencer") || requestedSite === "sara") {
    if (command === "build") {
        console.log("Only Spencer's site builds the blog; skipping Hugo.")
        process.exit(0)
    }
    const child = run("pnpm", ["exec", "vite"])
    process.on("SIGINT", () => child.kill("SIGINT"))
    process.on("SIGTERM", () => child.kill("SIGTERM"))
    child.on("error", (error) => fail(error.message))
    child.on("exit", (code) => process.exit(code ?? 1))
    await new Promise(() => {})
}

if (!process.env.HUGO_BINARY) await setupHugo()
const hugo = process.env.HUGO_BINARY ?? hugoBinary

const includeDrafts = command === "dev" || deploymentEnvironment === "dev" || deploymentEnvironment === "stg"
const themeSource = join(root, "public/blog-theme.css")
const themeStylesheet =
    command === "build"
        ? `/blog-theme.${createHash("sha256").update(readFileSync(themeSource)).digest("hex").slice(0, 16)}.css`
        : "/blog-theme.css"
const mediaSource = join(root, "public/blog-media.css")
const mediaStylesheet =
    command === "build"
        ? `/blog-media.${createHash("sha256").update(readFileSync(mediaSource)).digest("hex").slice(0, 16)}.css`
        : "/blog-media.css"
const postStylesheets = {}

// Render the same React header/footer into Hugo HTML, then hydrate their controls.
// The main Vite build shares React, styles and UI dependencies between both entries.
const { build: viteBuild } = await import("vite")
const chromeServerDirectory = join(root, "node_modules/.cache/blog-chrome")
const previousNodeEnv = process.env.NODE_ENV
await viteBuild({
    configFile: false,
    publicDir: false,
    resolve: { alias: { "@": join(root, "src") } },
    build: {
        ssr: join(root, "src/blog/chrome-server.tsx"),
        outDir: chromeServerDirectory,
        emptyOutDir: true,
        rolldownOptions: { output: { entryFileNames: "server.mjs" } },
    },
})
if (previousNodeEnv === undefined) delete process.env.NODE_ENV
else process.env.NODE_ENV = previousNodeEnv
const { renderBlogChrome, renderBlogContentsHeader } = await import(join(chromeServerDirectory, "server.mjs"))
const manifest = command === "build" ? JSON.parse(readFileSync(join(root, "dist/.vite/manifest.json"), "utf8")) : null
const chromeEntry = manifest?.["src/blog/chrome-client.tsx"]
const chromeStylesheets = new Set()
const visitedEntries = new Set()
function collectStyles(entry) {
    if (visitedEntries.has(entry)) return
    visitedEntries.add(entry)
    for (const css of entry.css ?? []) chromeStylesheets.add(`/${css}`)
    for (const dependency of entry.imports ?? []) collectStyles(manifest[dependency])
}
if (chromeEntry) collectStyles(chromeEntry)
// SSR chrome needs render-blocking CSS in development too, before hydration loads.
if (command === "dev") chromeStylesheets.add("/src/index.css?direct")

const getHugoConfig = (websiteUrl, homepageUrl, basePath) => {
    const override =
        command === "dev" ? join(devDirectory, "runtime.json") : join(tmpdir(), "homepage-hugo-spencer-build.json")
    mkdirSync(dirname(override), { recursive: true })
    writeFileSync(
        override,
        JSON.stringify({
            baseURL: `${websiteUrl}${basePath}/`,
            layoutDir: join(root, "blog/layouts"),
            params: {
                contentsHeader: renderBlogContentsHeader(),
                homepageURL: homepageUrl,
                blogURL: `${websiteUrl}${basePath}/`,
                chromeHeader: renderBlogChrome({
                    homepageURL: homepageUrl,
                    blogURL: `${websiteUrl}${basePath}/`,
                    section: "header",
                }),
                chromeFooter: renderBlogChrome({
                    homepageURL: homepageUrl,
                    blogURL: `${websiteUrl}${basePath}/`,
                    section: "footer",
                }),
                chromeScript: chromeEntry ? `/${chromeEntry.file}` : "/src/blog/chrome-client.tsx",
                chromeStylesheets: [...chromeStylesheets],
                chromeDev: command === "dev",
                aboutURL: `${homepageUrl}${spencer.about.path}`,
                fullName: spencer.fullName,
                themeStylesheet,
                mediaStylesheet,
                postStylesheets,
                mermaidScript: command === "dev" ? "/src/blog/mermaid.ts" : "/assets/mermaid/embed.js",
            },
        })
    )
    return [join(source, "hugo.json"), override].join(",")
}

if (command === "build") {
    // Keep the blog renderer separate from the homepage's shared vendor bundle.
    const { build } = await import("vite")
    await build({
        configFile: false,
        publicDir: false,
        build: {
            outDir: join(root, "dist/assets/mermaid"),
            emptyOutDir: true,
            minify: true,
            lib: {
                entry: join(root, "src/blog/mermaid.ts"),
                formats: ["es"],
                fileName: () => "embed.js",
            },
        },
    })
    copyFileSync(themeSource, join(root, "dist", themeStylesheet.slice(1)))
    copyFileSync(mediaSource, join(root, "dist", mediaStylesheet.slice(1)))
    const stylesDirectory = join(source, "assets/css")
    if (existsSync(stylesDirectory)) {
        const stylesOutput = join(root, "dist/assets/blog-styles")
        mkdirSync(stylesOutput, { recursive: true })
        for (const file of readdirSync(stylesDirectory, { withFileTypes: true })) {
            if (!file.isFile() || !file.name.endsWith(".css")) continue
            const stylesheet = readFileSync(join(stylesDirectory, file.name))
            const hash = createHash("sha256").update(stylesheet).digest("hex").slice(0, 16)
            const filename = `${file.name.slice(0, -4)}.${hash}.css`
            writeFileSync(join(stylesOutput, filename), stylesheet)
            postStylesheets[`/assets/css/${file.name}`] = `/assets/blog-styles/${filename}`
        }
    }
    const websiteUrl = process.env.HOMEPAGE_URL ?? `https://${spencer.hostnames.prod}`
    const config = getHugoConfig(websiteUrl, websiteUrl, "/blog")
    const args = [
        "--source",
        source,
        "--destination",
        output,
        "--config",
        config,
        "--cacheDir",
        join(root, "node_modules/.cache/hugo-build"),
    ]
    if (includeDrafts) args.push("--buildDrafts", "--buildFuture")
    const child = run(hugo, args)
    child.on("error", (error) => fail(`Unable to start Hugo: ${error.message}`))
    child.on("exit", async (code, signal) => {
        process.exitCode = signal ? 1 : (code ?? 1)
        if (process.exitCode !== 0) return
        try {
            const replayDirectory = join(output, "assets/motion-replay")
            if (!existsSync(replayDirectory)) return
            for (const file of readdirSync(replayDirectory, { withFileTypes: true })) {
                if (!file.isFile() || !file.name.endsWith(".html")) continue
                const filename = join(replayDirectory, file.name)
                const html = readFileSync(filename, "utf8")
                const compact = await compactReplayData(html, filename)
                writeFileSync(filename, compact)
                console.log(`Compacted ${file.name}: ${Buffer.byteLength(html)} → ${Buffer.byteLength(compact)} bytes`)
            }
        } catch (error) {
            fail(`Unable to prepare replay assets: ${error.message}`)
        }
    })
} else {
    const isJointSite = !requestedSite || requestedSite === "selector"
    const publicBasePath = isJointSite ? "/spencer/blog" : "/blog"
    const children = []
    let stopping = false

    const stop = (signal = "SIGTERM") => {
        if (stopping) return
        stopping = true
        for (const child of children) {
            if (!child.killed) child.kill(signal)
        }
    }

    const viteEnvironment = {
        ...process.env,
        HOMEPAGE_BLOG_PROXIES: JSON.stringify({ [publicBasePath]: "http://127.0.0.1:4001" }),
    }
    const vite = run("pnpm", ["exec", "vite"], { env: viteEnvironment })
    children.push(vite)

    {
        // Static assets preserve their source timestamps. Keep the live server output
        // out of the OS temporary directory, where old files can be reclaimed.
        const destination = join(devDirectory, "public")
        const publicUrl = "http://localhost:5173"
        const homepageUrl = `${publicUrl}${isJointSite ? "/spencer" : ""}`
        const config = getHugoConfig(publicUrl, homepageUrl, publicBasePath)
        const args = [
            "server",
            "--source",
            source,
            "--destination",
            destination,
            "--config",
            config,
            "--bind",
            "127.0.0.1",
            "--port",
            "4001",
            "--appendPort=false",
            "--disableLiveReload",
            "--cacheDir",
            join(devDirectory, "cache"),
            "--noHTTPCache",
        ]
        if (includeDrafts) args.push("--buildDrafts", "--buildFuture")
        children.push(run(hugo, args))
    }

    for (const child of children) {
        child.on("error", (error) => {
            console.error(`Development process failed to start: ${error.message}`)
            process.exitCode = 1
            stop()
        })
        child.on("exit", (code, signal) => {
            if (!stopping) {
                process.exitCode = signal ? 1 : (code ?? 1)
                stop()
            }
        })
    }

    process.on("SIGINT", () => {
        if (process.stdout.isTTY) process.stdout.write("\n")
        stop("SIGINT")
    })
    process.on("SIGTERM", () => stop("SIGTERM"))
}

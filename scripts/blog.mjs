import { spawn } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { createConnection } from "node:net"
import { tmpdir } from "node:os"
import { dirname, isAbsolute, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const profiles = JSON.parse(readFileSync(join(root, "profiles.json"), "utf8"))
const command = process.argv[2]

const fail = (message) => {
    console.error(message)
    process.exit(1)
}

if (command !== "build" && command !== "dev") {
    fail("Usage: node scripts/blog.mjs <build|dev>")
}

const primaryProfile = Object.entries(profiles).find(([, profile]) => profile.primaryInfrastructure)?.[0]
if (!primaryProfile) fail("profiles.json must define one primaryInfrastructure profile")

const requestedSite = process.env.HOMEPAGE_SITE
const profileId = command === "dev" && (!requestedSite || requestedSite === "selector") ? primaryProfile : requestedSite
const profile = profileId ? profiles[profileId] : undefined
const blog = profile?.blog

const getBlogPaths = () => {
    const source = resolve(root, blog.source)
    const sourceRelative = relative(root, source)
    if (isAbsolute(sourceRelative) || sourceRelative.startsWith("..")) {
        fail(`Blog source must be inside the repository: ${blog.source}`)
    }
    if (!/^\/[a-z0-9][a-z0-9/_-]*$/i.test(blog.basePath) || blog.basePath.endsWith("/")) {
        fail(`Blog basePath must start with one slash and omit the trailing slash: ${blog.basePath}`)
    }
    return { source, output: resolve(root, `dist${blog.basePath}`) }
}

const run = (executable, args, options = {}) =>
    spawn(executable, args, {
        cwd: root,
        env: process.env,
        stdio: "inherit",
        ...options,
    })

const bundleEnvironment = {
    ...process.env,
    BUNDLE_GEMFILE: join(root, "blogs", "Gemfile"),
    BUNDLE_PATH: process.env.BUNDLE_PATH ?? join(root, "blogs", "vendor", "bundle"),
}

const getJekyllConfig = (websiteUrl, mode) => {
    const override = join(tmpdir(), `homepage-jekyll-${profileId}-${mode}.yml`)
    writeFileSync(override, `url: ${JSON.stringify(websiteUrl)}\nbaseurl: ${JSON.stringify(blog.basePath)}\n`)
    return `${join(resolve(root, blog.source), "_config.yml")},${override}`
}

if (command === "build") {
    if (!blog) {
        console.log(`No blog configured for ${requestedSite ?? "selector"}; skipping Jekyll build.`)
        process.exit(0)
    }

    const { source, output } = getBlogPaths()
    const websiteUrl = process.env.HOMEPAGE_URL ?? `https://${profile.hostnames.prod}`
    const config = getJekyllConfig(websiteUrl, "build")
    const child = run(
        "bundle",
        ["exec", "jekyll", "build", "--source", source, "--destination", output, "--config", config],
        { env: bundleEnvironment }
    )
    child.on("error", (error) => fail(`Unable to start Jekyll: ${error.message}`))
    child.on("exit", (code, signal) => (process.exitCode = signal ? 1 : (code ?? 1)))
} else {
    const children = []
    let stopping = false

    const stop = (signal = "SIGTERM") => {
        if (stopping) return
        stopping = true
        for (const child of children) {
            if (!child.killed) child.kill(signal)
        }
    }

    const announceWhenReady = (port, url) => {
        const attempt = () => {
            if (stopping) return
            const socket = createConnection({ host: "127.0.0.1", port })
            socket.once("connect", () => {
                socket.destroy()
                if (!stopping) console.log(`  ➜  Blog:   ${url}`)
            })
            socket.once("error", () => {
                socket.destroy()
                setTimeout(attempt, 100)
            })
        }
        attempt()
    }

    const viteEnvironment = { ...process.env }
    if (blog) viteEnvironment.HOMEPAGE_BLOG_PROXY_PATH = blog.basePath
    const vite = run("pnpm", ["exec", "vite"], { env: viteEnvironment })
    children.push(vite)

    if (blog) {
        const { source } = getBlogPaths()
        const port = "4001"
        const destination = join(tmpdir(), `homepage-jekyll-${profileId}-${command}`)
        const config = getJekyllConfig(`http://localhost:${port}`, command)
        const jekyll = run(
            "bundle",
            [
                "exec",
                "jekyll",
                "serve",
                "--source",
                source,
                "--destination",
                destination,
                "--config",
                config,
                "--host",
                "127.0.0.1",
                "--port",
                port,
                "--livereload",
                "--quiet",
            ],
            { env: bundleEnvironment, stdio: ["inherit", "ignore", "inherit"] }
        )
        children.push(jekyll)
        announceWhenReady(Number(port), `http://localhost:5173${blog.basePath}/`)
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

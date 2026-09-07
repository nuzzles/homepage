import { spawn } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
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

const requestedSite = process.env.HOMEPAGE_SITE
const profileId = requestedSite
const profile = profileId ? profiles[profileId] : undefined
const blog = profile?.blog

const getBlogPaths = (blogConfig) => {
    const source = resolve(root, blogConfig.source)
    const sourceRelative = relative(root, source)
    if (isAbsolute(sourceRelative) || sourceRelative.startsWith("..")) {
        fail(`Blog source must be inside the repository: ${blogConfig.source}`)
    }
    if (!/^\/[a-z0-9][a-z0-9/_-]*$/i.test(blogConfig.basePath) || blogConfig.basePath.endsWith("/")) {
        fail(`Blog basePath must start with one slash and omit the trailing slash: ${blogConfig.basePath}`)
    }
    return { source, output: resolve(root, `dist${blogConfig.basePath}`) }
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

const getJekyllConfig = (id, blogConfig, websiteUrl, homepageUrl, basePath, mode) => {
    const override = join(tmpdir(), `homepage-jekyll-${id}-${mode}.yml`)
    writeFileSync(
        override,
        `url: ${JSON.stringify(websiteUrl)}\nhomepage_url: ${JSON.stringify(homepageUrl)}\nbaseurl: ${JSON.stringify(basePath)}\n`
    )
    return `${join(resolve(root, blogConfig.source), "_config.yml")},${override}`
}

if (command === "build") {
    if (!blog) {
        console.log(`No blog configured for ${requestedSite ?? "selector"}; skipping Jekyll build.`)
        process.exit(0)
    }

    const { source, output } = getBlogPaths(blog)
    const websiteUrl = process.env.HOMEPAGE_URL ?? `https://${profile.hostnames.prod}`
    const config = getJekyllConfig(profileId, blog, websiteUrl, websiteUrl, blog.basePath, "build")
    const child = run(
        "bundle",
        ["exec", "jekyll", "build", "--source", source, "--destination", output, "--config", config],
        { env: bundleEnvironment }
    )
    child.on("error", (error) => fail(`Unable to start Jekyll: ${error.message}`))
    child.on("exit", (code, signal) => (process.exitCode = signal ? 1 : (code ?? 1)))
} else {
    const isJointSite = !requestedSite || requestedSite === "selector"
    const devProfiles = isJointSite ? Object.entries(profiles) : [[requestedSite, profile]]
    const devBlogs = devProfiles
        .filter(([, devProfile]) => Boolean(devProfile?.blog))
        .map(([id, devProfile], index) => ({
            id,
            blog: devProfile.blog,
            port: 4001 + index,
            liveReloadPort: 35729 + index,
            publicBasePath: isJointSite ? `/${id}${devProfile.blog.basePath}` : devProfile.blog.basePath,
        }))
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
        HOMEPAGE_BLOG_PROXIES: JSON.stringify(
            Object.fromEntries(devBlogs.map(({ publicBasePath, port }) => [publicBasePath, `http://127.0.0.1:${port}`]))
        ),
    }
    const vite = run("pnpm", ["exec", "vite"], { env: viteEnvironment })
    children.push(vite)

    for (const { id, blog: devBlog, port, liveReloadPort, publicBasePath } of devBlogs) {
        const { source } = getBlogPaths(devBlog)
        const destination = join(tmpdir(), `homepage-jekyll-${id}-${command}`)
        const publicUrl = "http://localhost:5173"
        const homepageUrl = `${publicUrl}${isJointSite ? `/${id}` : ""}`
        const config = getJekyllConfig(id, devBlog, publicUrl, homepageUrl, publicBasePath, command)
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
                String(port),
                "--livereload",
                "--livereload-port",
                String(liveReloadPort),
                "--quiet",
            ],
            { env: bundleEnvironment, stdio: ["inherit", "ignore", "inherit"] }
        )
        children.push(jekyll)
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

import { createHash } from "node:crypto"
import { spawnSync } from "node:child_process"
import {
    chmodSync,
    copyFileSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const hugoVersion = "0.170.1"
export const hugoBinary = resolve(import.meta.dirname, `../node_modules/.cache/hugo/${hugoVersion}/hugo`)
const releases = {
    darwin: { file: "darwin-universal.pkg", sha: "f7672f5e47f13c488ecd9ae96450ed9d2044629d60fe23570312e896c1918d73" },
    "linux-x64": {
        file: "linux-amd64.tar.gz",
        sha: "841a5462853aefc9942e4de1e8a5d75584b6a5181941e6ad3f1d745190e03cd8",
    },
}
export async function setupHugo() {
    if (existsSync(hugoBinary)) return
    const release = releases[process.platform === "darwin" ? "darwin" : `${process.platform}-${process.arch}`]
    if (!release)
        throw new Error(
            "Automatic Hugo setup supports macOS and Linux x64. Set HUGO_BINARY to an installed Hugo executable on other platforms."
        )
    const directory = mkdtempSync(join(tmpdir(), "homepage-hugo-"))
    try {
        console.log(`Installing Hugo ${hugoVersion} from the official release…`)
        const response = await fetch(
            `https://github.com/gohugoio/hugo/releases/download/v${hugoVersion}/hugo_${hugoVersion}_${release.file}`
        )
        if (!response.ok) throw new Error(`Hugo download failed: HTTP ${response.status}`)
        const archive = join(directory, release.file)
        const bytes = Buffer.from(await response.arrayBuffer())
        if (createHash("sha256").update(bytes).digest("hex") !== release.sha) throw new Error("Hugo checksum mismatch")
        writeFileSync(archive, bytes)
        const extraction =
            process.platform === "darwin"
                ? spawnSync("pkgutil", ["--expand-full", archive, join(directory, "expanded")], { stdio: "inherit" })
                : spawnSync("tar", ["-xzf", archive, "-C", directory, "hugo"], { stdio: "inherit" })
        if (extraction.status !== 0) throw new Error("Unable to extract Hugo")
        mkdirSync(dirname(hugoBinary), { recursive: true })
        copyFileSync(
            process.platform === "darwin" ? join(directory, "expanded/Payload/hugo") : join(directory, "hugo"),
            hugoBinary
        )
        chmodSync(hugoBinary, 0o755)
        if (!readFileSync(hugoBinary).length) throw new Error("Empty Hugo binary")
    } finally {
        rmSync(directory, { recursive: true, force: true })
    }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await setupHugo()

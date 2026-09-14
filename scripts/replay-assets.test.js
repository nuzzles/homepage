import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { describe, expect, it } from "vitest"
import { compactReplayData } from "./replay-assets.mjs"

describe("deployed replay data", () => {
    it("preserves the complete Octagon data and all surrounding HTML while reducing the deployment size", async () => {
        const source = readFileSync("blogs/spencer/assets/motion-replay/octagon.html", "utf8")
        const output = await compactReplayData(source, "octagon.html")
        const dataScript = /<script>\s*(const CLIPS\s*=[\s\S]*?)<\/script>/i
        const decoded = (html) =>
            runInNewContext(`${dataScript.exec(html)[1]}; JSON.stringify(CLIPS)`, {}, { timeout: 5000 })

        expect(decoded(output)).toBe(decoded(source))
        expect(output.replace(dataScript, "DATA")).toBe(source.replace(dataScript, "DATA"))
        expect(Buffer.byteLength(output)).toBeLessThan(10_000_000)
        expect(Buffer.byteLength(output)).toBeLessThan(Buffer.byteLength(source))
    })

    it("fails visibly if the exporter changes its data format or produces invalid JavaScript", async () => {
        await expect(compactReplayData("<script>const RECORDINGS = []</script>", "changed.html")).rejects.toThrow(
            "Missing embedded replay data"
        )
        await expect(compactReplayData("<script>const CLIPS = [</script>", "invalid.html")).rejects.toThrow()
    })
})

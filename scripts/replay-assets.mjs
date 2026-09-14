import { minify } from "vite"

// Generated replay exports embed a large CLIPS literal. Compact that script only:
// keep the checked-in export readable and leave renderer code and licenses intact.
export async function compactReplayData(html, filename) {
    const match = /<script>\s*(const CLIPS\s*=[\s\S]*?)<\/script>/i.exec(html)
    if (!match) throw new Error(`Missing embedded replay data in ${filename}`)
    const result = await minify(`${filename}.js`, match[1], {
        module: false,
        compress: false,
        mangle: false,
        codegen: { removeWhitespace: true, legalComments: "inline" },
    })
    if (result.errors.length) throw new Error(`Unable to compact ${filename}: ${JSON.stringify(result.errors)}`)
    // A generated string must never terminate the surrounding HTML script element.
    if (/<\/script/i.test(result.code)) throw new Error(`Unsafe script closing tag in ${filename}`)
    return html.slice(0, match.index) + `<script>${result.code}</script>` + html.slice(match.index + match[0].length)
}

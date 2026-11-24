type Node = {
    type: string
    value?: string
    children?: Node[]
    data?: { hProperties?: Record<string, unknown> }
}
const text = (node: Node): string => node.value ?? node.children?.map(text).join("") ?? ""

/** Namespace nested headings by their stable About section, including repeated titles. */
export function remarkHeadingIds({ prefix }: { prefix: string }) {
    return (tree: Node) => {
        const used = new Set<string>()
        const visit = (node: Node) => {
            if (node.type === "heading") {
                const slug =
                    text(node)
                        .normalize("NFKC")
                        .toLowerCase()
                        .replace(/[^\p{L}\p{N}\s_-]/gu, "")
                        .trim()
                        .replace(/\s+/g, "-") || "section"
                const base = `${prefix}-${slug}`
                let id = base
                let suffix = 1
                while (used.has(id)) id = `${base}-${suffix++}`
                used.add(id)
                node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
            }
            node.children?.forEach(visit)
        }
        visit(tree)
    }
}

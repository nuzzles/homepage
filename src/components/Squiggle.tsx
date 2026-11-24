import { useEffect, useRef, useState, type ReactNode } from "react"

const wavePath = (width: number) => {
    // Inset the path by its round cap, and trim the last curve without clipping its stroke.
    let path = "M2 6"
    for (let x = 2, segment = 0; x < width - 2; x += 12, segment++) {
        const fraction = Math.min(1, (width - 2 - x) / 12)
        const bend = segment % 2 === 0 ? -6 : 6
        path += `Q${x + 6 * fraction} ${6 + bend * fraction} ${x + 12 * fraction} ${6 + 2 * bend * fraction * (1 - fraction)}`
    }
    return path
}

/** A shared hand-drawn underline for the profile's home links. */
export const Squiggle = ({ children }: { children: ReactNode }) => {
    const svgRef = useRef<SVGSVGElement>(null)
    const [width, setWidth] = useState(96)
    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return
        const measure = () => {
            const nextWidth = svg.getBoundingClientRect().width
            if (nextWidth > 4) setWidth(nextWidth)
        }
        measure()
        if (typeof ResizeObserver === "undefined") return
        const observer = new ResizeObserver(measure)
        observer.observe(svg)
        return () => observer.disconnect()
    }, [])
    return (
        <span className="squiggle">
            {children}
            <svg ref={svgRef} viewBox={`0 0 ${width} 12`} width="100%" height="12" aria-hidden="true" focusable="false">
                <path d={wavePath(width)} />
            </svg>
        </span>
    )
}

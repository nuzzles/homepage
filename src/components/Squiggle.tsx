import { useEffect, useRef, type ReactNode } from "react"

const wavePath = (width: number, phase = 0) => {
    // Quantize coordinates so server and browser math serialize identically.
    const coordinate = (value: number) => Number(value.toFixed(3))
    const frequency = (Math.PI * 2) / 24
    const y = (x: number) => 6 + 3 * Math.sin((x - 2) * frequency + phase)
    const slope = (x: number) => 3 * frequency * Math.cos((x - 2) * frequency + phase)
    let path = `M2 ${coordinate(y(2))}`
    // Cubic segments preserve the smooth wave and its rounded, inset endpoints.
    for (let x = 2; x < width - 2; x += 4) {
        const end = Math.min(x + 4, width - 2)
        const third = (end - x) / 3
        path += `C${coordinate(x + third)} ${coordinate(y(x) + slope(x) * third)} ${coordinate(end - third)} ${coordinate(y(end) - slope(end) * third)} ${coordinate(end)} ${coordinate(y(end))}`
    }
    return path
}

/** A fixed-wavelength underline whose wave flows on hover or keyboard focus. */
export const Squiggle = ({ children }: { children: ReactNode }) => {
    const svgRef = useRef<SVGSVGElement>(null)
    useEffect(() => {
        const svg = svgRef.current
        const path = svg?.querySelector("path")
        const link = svg?.closest("a")
        if (!svg || !path || !link) return
        const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)")
        let width = 96
        let frame = 0
        let phase = 0
        let previousTime = 0
        let hovered = false
        let focused = false
        const paint = () => path.setAttribute("d", wavePath(width, phase))
        const animate = (time: number) => {
            if (previousTime) phase = (phase + (Math.min(time - previousTime, 50) / 1600) * Math.PI * 2) % (Math.PI * 2)
            previousTime = time
            paint()
            frame = requestAnimationFrame(animate)
        }
        const update = () => {
            cancelAnimationFrame(frame)
            previousTime = 0
            if ((hovered || focused) && !motion?.matches) frame = requestAnimationFrame(animate)
            else if (motion?.matches) {
                phase = 0
                paint()
            } else {
                const from = phase
                // Continue forward to the next idle phase without reversing
                // or moving the underline container.
                const target = Math.ceil(from / (Math.PI * 2)) * Math.PI * 2
                const duration = Math.max(280, ((target - from) / (Math.PI * 2)) * 1600)
                let started: number | undefined
                const settle = (time: number) => {
                    started ??= time
                    const progress = Math.min((time - started) / duration, 1)
                    const eased = progress * progress * (3 - 2 * progress)
                    phase = from + (target - from) * eased
                    if (progress === 1) phase = 0
                    paint()
                    if (progress < 1) frame = requestAnimationFrame(settle)
                }
                frame = requestAnimationFrame(settle)
            }
        }
        const enter = () => {
            hovered = true
            update()
        }
        const leave = () => {
            hovered = false
            update()
        }
        const focus = () => {
            focused = true
            update()
        }
        const blur = () => {
            focused = false
            update()
        }
        const measure = () => {
            const nextWidth = svg.getBoundingClientRect().width
            if (nextWidth > 4) {
                width = nextWidth
                svg.setAttribute("viewBox", `0 0 ${width} 12`)
                paint()
            }
        }
        measure()
        const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null
        observer?.observe(svg)
        link.addEventListener("pointerenter", enter)
        link.addEventListener("pointerleave", leave)
        link.addEventListener("focus", focus)
        link.addEventListener("blur", blur)
        motion?.addEventListener("change", update)
        return () => {
            cancelAnimationFrame(frame)
            observer?.disconnect()
            link.removeEventListener("pointerenter", enter)
            link.removeEventListener("pointerleave", leave)
            link.removeEventListener("focus", focus)
            link.removeEventListener("blur", blur)
            motion?.removeEventListener("change", update)
        }
    }, [])
    return (
        <span className="squiggle">
            {children}
            <svg
                ref={svgRef}
                viewBox="0 0 96 12"
                preserveAspectRatio="none"
                width="100%"
                height="12"
                aria-hidden="true"
                focusable="false"
            >
                <path d={wavePath(96)} />
            </svg>
        </span>
    )
}

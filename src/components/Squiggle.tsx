import { useId, type ReactNode } from "react"

/** A shared hand-drawn underline for the profile's home links. */
export const Squiggle = ({ children }: { children: ReactNode }) => {
    const patternId = `squiggle-${useId()}`
    return (
        <span className="squiggle">
            {children}
            <svg width="100%" height="12" aria-hidden="true" focusable="false">
                <defs>
                    <pattern id={patternId} width="24" height="12" patternUnits="userSpaceOnUse">
                        <path d="M-12 6Q-6 0 0 6T12 6T24 6T36 6" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
        </span>
    )
}

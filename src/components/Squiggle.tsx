import type { ReactNode } from "react"

/** A shared hand-drawn underline for the profile's home links. */
export const Squiggle = ({ children }: { children: ReactNode }) => (
    <span className="squiggle">
        {children}
        <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength="1" d="M2 8C10 8 10 2 18 2S26 10 34 10 42 2 50 2 58 10 66 10 74 2 82 2 90 9 98 8" />
        </svg>
    </span>
)

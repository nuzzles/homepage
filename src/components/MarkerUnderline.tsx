import type { ReactNode } from "react"

/** Shared marker treatment; Hugo uses the same class and CSS via its render partial. */
export const MarkerUnderline = ({ children }: { children?: ReactNode }) => (
    <span className="marker-underline">{children}</span>
)

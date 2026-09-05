import type { ReactNode } from "react"
import { Box } from "@mui/material"

const corners = [
    { top: 0, left: 0, borderTop: 1, borderLeft: 1 },
    { top: 0, right: 0, borderTop: 1, borderRight: 1 },
    { bottom: 0, left: 0, borderBottom: 1, borderLeft: 1 },
    { right: 0, bottom: 0, borderRight: 1, borderBottom: 1 },
] as const

export const CornerFrame = ({ children }: { children: ReactNode }) => (
    <Box sx={{ position: "relative", p: "8px" }}>
        {corners.map((corner, index) => (
            <Box
                key={index}
                aria-hidden="true"
                sx={(theme) => ({
                    position: "absolute",
                    width: 28,
                    height: 28,
                    pointerEvents: "none",
                    borderColor: theme.palette.border.light,
                    ...corner,
                })}
            />
        ))}
        {children}
    </Box>
)

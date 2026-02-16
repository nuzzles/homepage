import type React from "react"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { lightTheme } from "@/theme/light-theme"

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    const theme = lightTheme
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

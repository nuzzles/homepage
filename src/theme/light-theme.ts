import { createTheme } from "@mui/material/styles"
import {
    lightFontFamily,
    lightFontWeight,
    lightBackground,
    lightText,
    lightBorder,
    lightColor,
} from "./light-tokens"

// MUI module augmentation for custom palette keys
declare module "@mui/material/styles" {
    interface Palette {
        accent: Palette["primary"]
        border: { main: string; light: string; hover: string }
    }
    interface PaletteOptions {
        accent?: PaletteOptions["primary"]
        border?: { main?: string; light?: string; hover?: string }
    }
    interface TypeBackground {
        sidebar: string
        elevated: string
    }
    interface TypeText {
        selected: string
        button: string
        input: string
        helper: string
        inactive: string
        placeholder: string
    }
}

export const lightTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: lightColor.blue[500],
            dark: lightColor.blue[600],
        },
        secondary: {
            main: lightColor.pink[500],
        },
        accent: {
            main: lightColor.green[500],
        },
        background: {
            default: lightBackground.base.default,
            paper: lightBackground.surface.default,
            sidebar: lightBackground.surface.sidebar,
            elevated: lightBackground.surface.elevated,
        },
        text: {
            primary: lightText.primary,
            secondary: lightText.secondary,
            selected: lightText.selected,
            button: lightText.button,
            input: lightText.input,
            helper: lightText.helper,
            inactive: lightText.inactive,
            placeholder: lightText.placeholder,
        },
        divider: lightBorder.main,
        border: {
            main: lightBorder.main,
            light: lightBorder.light,
            hover: lightBorder.hover,
        },
        common: {
            white: lightColor.white,
            black: lightColor.black,
        },
    },
    typography: {
        fontFamily: lightFontFamily,

        h1: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.extraBold,
            letterSpacing: "0.02em",
        },
        h2: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.bold,
            letterSpacing: "0.02em",
        },
        h3: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.semiBold,
            letterSpacing: "0.02em",
        },
        h4: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.semiBold,
        },
        h5: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.medium,
        },
        h6: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.medium,
        },

        subtitle1: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.medium,
        },
        subtitle2: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.medium,
        },
        body1: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.regular,
        },
        body2: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.regular,
        },

        button: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.semiBold,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
        },
        caption: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.regular,
        },
        overline: {
            fontFamily: lightFontFamily,
            fontWeight: lightFontWeight.medium,
            letterSpacing: "0.2em",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: lightFontFamily,
                },
            },
        },
    },
})

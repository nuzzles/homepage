import { createTheme } from "@mui/material/styles"
import {
    lightFontFamily,
    lightDisplayFontFamily,
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
        mode: "light",
        primary: {
            main: lightColor.blue[700],
            dark: lightColor.blue[600],
            light: lightColor.blue[500],
            contrastText: lightColor.grey[50],
        },
        secondary: {
            main: lightColor.grey[900],
        },
        accent: {
            main: lightColor.blue[700],
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
            fontFamily: lightDisplayFontFamily,
            fontWeight: lightFontWeight.extraBold,
            letterSpacing: "0.02em",
        },
        h2: {
            fontFamily: lightDisplayFontFamily,
            fontWeight: lightFontWeight.bold,
            letterSpacing: "0.02em",
        },
        h3: {
            fontFamily: lightDisplayFontFamily,
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
            fontWeight: lightFontWeight.bold,
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
        MuiLink: {
            styleOverrides: {
                root: {
                    color: lightColor.blue[700],
                    "&:hover": {
                        color: lightColor.blue[500],
                    },
                },
            },
        },
        MuiTooltip: {
            defaultProps: {
                enterDelay: 450,
            },
            styleOverrides: {
                tooltip: {
                    padding: "7px 10px",
                    maxWidth: 220,
                    color: lightText.primary,
                    backgroundColor: lightBackground.surface.elevated,
                    border: `1px solid ${lightColor.grey[900]}`,
                    borderRadius: 0,
                    boxShadow: `3px 3px 0 ${lightColor.blue[700]}`,
                    fontFamily: lightDisplayFontFamily,
                    fontSize: "0.72rem",
                    fontWeight: lightFontWeight.extraBold,
                    lineHeight: 1.2,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: lightBackground.base.default,
                    backgroundImage: `radial-gradient(${lightColor.grey[300]}55 0.55px, transparent 0.55px)`,
                    backgroundSize: "5px 5px",
                },
                "#root::before": {
                    content: '""',
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    border: `2px solid ${lightColor.grey[900]}`,
                    pointerEvents: "none",
                },
                "::selection": {
                    backgroundColor: lightColor.blue[700],
                    color: lightColor.grey[50],
                },
                a: {
                    color: lightColor.blue[700],
                    textDecoration: "none",
                    "&:hover": {
                        color: lightColor.blue[500],
                    },
                },
            },
        },
    },
})

/**
 * Light Design Tokens
 */

// ---------------------------------------------------------------------------
// Font
// ---------------------------------------------------------------------------
export const lightFontFamily = [
    "Barlow",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
].join(",")

export const lightDisplayFontFamily = ["Barlow Condensed", "Arial Narrow", "Barlow", "sans-serif"].join(",")

export const lightFontWeight = {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
} as const

// ---------------------------------------------------------------------------
// Core palette
// ---------------------------------------------------------------------------
export const lightColor = {
    blue: {
        700: "#2047D6",
        600: "#1838AE",
        500: "#395BD2",
    },
    pink: {
        500: "#ff4081",
    },
    green: {
        500: "#00C802",
        400: "#4ade80",
        300: "#86efac",
    },
    red: {
        600: "#dc2626",
        500: "#FF2525",
        400: "#f87171",
        300: "#fca5a5",
    },
    yellow: {
        500: "#EBB600",
        400: "#facc15",
        300: "#fde047",
    },
    grey: {
        900: "#171813",
        800: "#292A23",
        700: "#48483D",
        600: "#68675A",
        500: "#8F8B7A",
        400: "#AAA694",
        300: "#C6C1AE",
        200: "#DAD5C2",
        100: "#E8E3D1",
        50: "#F3EEDF",
    },
    white: "#FCFAF3",
    black: "#10110D",
} as const

// ---------------------------------------------------------------------------
// Semantic tokens (light theme)
// ---------------------------------------------------------------------------
export const lightBackground = {
    base: {
        default: lightColor.grey[50],
    },
    surface: {
        default: lightColor.grey[50],
        sidebar: lightColor.grey[100],
        elevated: lightColor.white,
    },
} as const

export const lightText = {
    primary: lightColor.grey[900],
    secondary: lightColor.grey[700],
    selected: lightColor.grey[800],
    button: lightColor.grey[900],
    input: lightColor.grey[900],
    helper: lightColor.grey[600],
    inactive: lightColor.grey[500],
    placeholder: lightColor.grey[600],
} as const

export const lightBorder = {
    main: lightColor.grey[500],
    light: lightColor.grey[300],
    hover: lightColor.grey[700],
} as const

// ---------------------------------------------------------------------------
// Component tokens
// ---------------------------------------------------------------------------
export const lightButtonTokens = {
    radius: "0px",
    fontWeight: lightFontWeight.semiBold,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    padding: {
        small: { x: "16px", y: "6px" },
        medium: { x: "24px", y: "12px" },
        large: { x: "32px", y: "16px" },
    },
    minHeight: {
        small: 36,
        medium: 48,
        large: 56,
    },
} as const

export const lightFocus = {
    color: lightColor.blue[700],
    width: "2px",
    offset: "2px",
} as const

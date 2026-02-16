/**
 * Light Design Tokens (Dark Theme)
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
        600: "#0066ff",
        500: "#4d88ff",
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
    blue2: {
        500: "#3b82f6",
        400: "#60a5fa",
        300: "#93c5fd",
    },
    grey: {
        900: "#121212",
        850: "#1a1a1a",
        800: "#1e1e1e",
        700: "#2d2d2d",
        600: "#333333",
        500: "#444444",
        400: "#484848",
        300: "#707070",
        200: "#8E8E8E",
        150: "#B0B0B0",
        100: "#CACACA",
        75: "#DEDEDE",
        50: "#EAEAEA",
        25: "#F5F5F5",
    },
    white: "#ffffff",
    black: "#000000",
} as const

// ---------------------------------------------------------------------------
// Semantic tokens (dark theme)
// ---------------------------------------------------------------------------
export const lightBackground = {
    base: {
        default: lightColor.grey[900], // #121212
    },
    surface: {
        default: lightColor.grey[800], // #1e1e1e
        sidebar: lightColor.grey[850], // #1a1a1a
        elevated: lightColor.grey[700], // #2d2d2d
    },
} as const

export const lightText = {
    primary: lightColor.white, // #ffffff
    secondary: lightColor.grey[150], // #B0B0B0
    selected: lightColor.grey[25], // #F5F5F5
    button: lightColor.grey[50], // #EAEAEA
    input: lightColor.grey[75], // #DEDEDE
    helper: lightColor.grey[100], // #CACACA
    inactive: lightColor.grey[200], // #8E8E8E
    placeholder: lightColor.grey[300], // #707070
} as const

export const lightBorder = {
    main: lightColor.grey[600], // #333333
    light: lightColor.grey[400], // #484848
    hover: lightColor.grey[500], // #444444
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
    color: lightColor.green[500], // #00C802 (accent green)
    width: "2px",
    offset: "2px",
} as const

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
        700: "#0033DD",
        600: "#0066ff",
        500: "#4C7FFF",
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
        900: "#212529",
        800: "#32383E",
        700: "#495057",
        600: "#6c757d",
        500: "#adb5bd",
        400: "#ced4da",
        300: "#dee2e6",
        200: "#e9ecef",
        100: "#f1f3f5",
        50: "#F8F9FA",
    },
    white: "#ffffff",
    black: "#000000",
} as const

// ---------------------------------------------------------------------------
// Semantic tokens (light theme)
// ---------------------------------------------------------------------------
export const lightBackground = {
    base: {
        default: lightColor.grey[50], // #F8F9FA
    },
    surface: {
        default: lightColor.white,
        sidebar: lightColor.grey[100],
        elevated: lightColor.white,
    },
} as const

export const lightText = {
    primary: lightColor.grey[900], // #212529
    secondary: lightColor.grey[700], // #495057
    selected: lightColor.grey[800], // #32383E
    button: lightColor.grey[900], // #212529
    input: lightColor.grey[900],
    helper: lightColor.grey[600],
    inactive: lightColor.grey[500],
    placeholder: lightColor.grey[600],
} as const

export const lightBorder = {
    main: lightColor.grey[400], // #ced4da
    light: lightColor.grey[300], // #dee2e6
    hover: lightColor.grey[500], // #adb5bd
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

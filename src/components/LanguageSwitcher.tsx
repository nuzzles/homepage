import { useState, type MouseEvent } from "react"
import { Box, Button, Menu, MenuItem } from "@mui/material"
import ArrowDropDown from "@mui/icons-material/ArrowDropDown"
import { alpha } from "@mui/material/styles"
import { useLanguage } from "@/hooks/useLanguage"
import { SELECTOR_CARET_SIZE } from "@/components/selectorStyles"

const languages = [
    { code: "en", label: "ENGLISH", flag: "/images/flags/us.svg" },
    { code: "fr", label: "FRANÇAIS", flag: "/images/flags/fr.svg" },
    { code: "fa", label: "فارسی", flag: "/images/flags/ir.svg" },
] as const

const languageTypography = {
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
    fontSize: "0.875rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
} as const

export const LanguageSwitcher = () => {
    const { t, language, languageHref, rememberLanguage } = useLanguage()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const selected = languages.find(({ code }) => code === language) ?? languages[0]
    const open = Boolean(anchorEl)

    const handleOpen = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    return (
        <>
            <Button
                id="language-switcher-button"
                aria-label={t("languageSwitcher.label")}
                aria-controls={open ? "language-switcher-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="menu"
                endIcon={<ArrowDropDown />}
                disableRipple
                onClick={handleOpen}
                sx={(theme) => ({
                    minWidth: 0,
                    minHeight: 36,
                    px: 0.75,
                    py: 0,
                    marginInlineStart: { xs: "auto", sm: 0 },
                    flexShrink: 0,
                    gap: 0.75,
                    color: theme.palette.text.primary,
                    backgroundColor: "transparent",
                    ...languageTypography,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    "& .MuiButton-endIcon": {
                        marginInlineStart: 0,
                        marginInlineEnd: -0.5,
                        "& svg": { fontSize: SELECTOR_CARET_SIZE },
                    },
                    "&:hover": {
                        color: theme.palette.primary.main,
                        backgroundColor: "transparent",
                    },
                    "&:focus": {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: 2,
                    },
                })}
            >
                <Box
                    component="img"
                    src={selected.flag}
                    alt=""
                    sx={{ width: 18, height: 12, objectFit: "cover", flexShrink: 0 }}
                />
                <Box
                    component="span"
                    sx={{
                        display: "none",
                        "@media (min-width: 680px)": { display: "inline" },
                    }}
                >
                    {selected.label}
                </Box>
            </Button>
            <Menu
                id="language-switcher-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    list: { "aria-labelledby": "language-switcher-button", dense: true },
                    paper: {
                        sx: (theme) => ({
                            mt: 0.75,
                            borderRadius: 0,
                            border: `1px solid ${theme.palette.text.primary}`,
                            boxShadow: `4px 4px 0 ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.background.paper,
                        }),
                    },
                }}
            >
                {languages
                    .filter(({ code }) => code !== language)
                    .map(({ code, label, flag }) => (
                        <MenuItem
                            key={code}
                            component="a"
                            href={languageHref(code)}
                            hrefLang={code}
                            onClick={() => rememberLanguage(code)}
                            sx={(theme) => ({
                                px: 1.5,
                                py: 0.75,
                                gap: 0.75,
                                ...languageTypography,
                                textTransform: "uppercase",
                                "&:hover, &.Mui-focusVisible": {
                                    color: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                            })}
                        >
                            <Box
                                component="img"
                                src={flag}
                                alt=""
                                sx={{ width: 20, height: 14, objectFit: "cover", flexShrink: 0 }}
                            />
                            {label}
                        </MenuItem>
                    ))}
            </Menu>
        </>
    )
}

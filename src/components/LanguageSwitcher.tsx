import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { Select, MenuItem, Box } from "@mui/material"
import { alpha } from "@mui/material/styles"
import type { SelectChangeEvent } from "@mui/material"
import { stripLanguagePrefix, getUrlPrefix } from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

const languages = [
    { code: "en", label: "ENGLISH", flag: "/images/flags/us.svg" },
    { code: "fr", label: "FRANÇAIS", flag: "/images/flags/fr.svg" },
    { code: "fa", label: "فارسی", flag: "/images/flags/ir.svg" },
] as const

export const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const handleChange = (e: SelectChangeEvent) => {
        const newLang = e.target.value as SupportedLanguage
        localStorage.setItem("preferredLanguage", newLang)
        i18n.changeLanguage(newLang)
        const basePath = stripLanguagePrefix(location.pathname)
        const prefix = getUrlPrefix(newLang)
        const newPath = basePath === "/" ? prefix || "/" : `${prefix}${basePath}`
        navigate(newPath)
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box
                component="span"
                sx={(theme) => ({
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: theme.palette.text.secondary,
                    whiteSpace: "nowrap",
                })}
            >
                {t("languageSwitcher.label")}
            </Box>
            <Select
                value={i18n.language}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={(theme) => ({
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: theme.palette.text.secondary,
                    borderRadius: 0,
                    minHeight: 36,
                    "&:hover": {
                        backgroundColor: alpha(theme.palette.text.primary, 0.06),
                        color: theme.palette.primary.main,
                    },
                    "&:active": {
                        backgroundColor: alpha(theme.palette.text.primary, 0.1),
                        color: theme.palette.primary.dark,
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                    ".MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        py: "6px",
                        px: "12px",
                    },
                    ".MuiSelect-icon": {
                        color: theme.palette.text.secondary,
                    },
                })}
                MenuProps={{
                    PaperProps: {
                        sx: (theme) => ({
                            borderRadius: 0,
                            boxShadow: "none",
                            border: `1px solid ${theme.palette.border.main}`,
                            "& .MuiMenuItem-root": {
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.text.primary, 0.06),
                                },
                                "&.Mui-selected": {
                                    backgroundColor: alpha(theme.palette.text.primary, 0.08),
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette.text.primary, 0.1),
                                    },
                                },
                            },
                        }),
                    },
                }}
            >
                {languages.map(({ code, label, flag }) => (
                    <MenuItem key={code} value={code} sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                            component="img"
                            src={flag}
                            alt=""
                            sx={{ width: 20, height: 14, objectFit: "cover", marginInlineEnd: 0.75, verticalAlign: "middle" }}
                        />
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    )
}

import { Box, MenuItem, Select } from "@mui/material"
import { alpha } from "@mui/material/styles"
import type { SelectChangeEvent } from "@mui/material"
import { useLanguage } from "@/hooks/useLanguage"
import type { SupportedLanguage } from "@/i18n/i18n"

const languages = [
    { code: "en", label: "ENGLISH", flag: "/images/flags/us.svg" },
    { code: "fr", label: "FRANÇAIS", flag: "/images/flags/fr.svg" },
    { code: "fa", label: "فارسی", flag: "/images/flags/ir.svg" },
] as const

export const LanguageSwitcher = () => {
    const { t, language, switchLanguage } = useLanguage()

    return (
        <Select
            value={language}
            onChange={(event: SelectChangeEvent) => switchLanguage(event.target.value as SupportedLanguage)}
            variant="outlined"
            size="small"
            inputProps={{ "aria-label": t("languageSwitcher.label") }}
            renderValue={(value) => {
                const selected = languages.find(({ code }) => code === value) ?? languages[0]
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box
                            component="img"
                            src={selected.flag}
                            alt=""
                            sx={{ width: 18, height: 12, objectFit: "cover" }}
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
                    </Box>
                )
            }}
            sx={(theme) => ({
                flexShrink: 0,
                minHeight: 36,
                borderRadius: 0,
                color: theme.palette.text.button,
                backgroundColor: theme.palette.background.paper,
                fontFamily: theme.typography.button.fontFamily,
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: theme.transitions.create(["background-color", "color", "transform"], {
                    duration: theme.transitions.duration.shortest,
                }),
                "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.sidebar,
                    transform: "translateY(-1px)",
                },
                ".MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.text.primary },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.text.primary },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 1,
                    borderColor: theme.palette.text.primary,
                },
                "&.Mui-focused": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                },
                ".MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    py: "6px",
                    pl: "10px",
                    pr: "30px !important",
                    "@media (min-width: 680px)": {
                        pl: "14px",
                        pr: "34px !important",
                    },
                },
                ".MuiSelect-icon": {
                    color: theme.palette.text.primary,
                    fontSize: "1.1rem",
                    right: 6,
                    "@media (min-width: 680px)": { right: 10 },
                },
            })}
            MenuProps={{
                slotProps: {
                    paper: {
                        sx: (theme) => ({
                            borderRadius: 0,
                            boxShadow: "none",
                            border: `1px solid ${theme.palette.text.primary}`,
                            "& .MuiMenuItem-root": {
                                fontFamily: theme.typography.button.fontFamily,
                                fontSize: "0.875rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.06) },
                                "&.Mui-selected": {
                                    backgroundColor: alpha(theme.palette.text.primary, 0.08),
                                    "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.1) },
                                },
                            },
                        }),
                    },
                },
            }}
        >
            {languages.map(({ code, label, flag }) => (
                <MenuItem key={code} value={code} sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                        component="img"
                        src={flag}
                        alt=""
                        sx={{ width: 20, height: 14, objectFit: "cover", marginInlineEnd: 0.75 }}
                    />
                    {label}
                </MenuItem>
            ))}
        </Select>
    )
}

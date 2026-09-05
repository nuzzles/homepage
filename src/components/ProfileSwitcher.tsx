import { useState, type MouseEvent } from "react"
import { Button, Menu, MenuItem } from "@mui/material"
import ArrowDropDown from "@mui/icons-material/ArrowDropDown"
import { alpha } from "@mui/material/styles"
import { PROFILE_OPTIONS, type ProfileId } from "@/profiles"
import { SELECTOR_CARET_SIZE } from "@/components/selectorStyles"

interface ProfileSwitcherProps {
    value: ProfileId
    label: string
    hrefForProfile: (profile: ProfileId) => string
}

export const ProfileSwitcher = ({ value, label, hrefForProfile }: ProfileSwitcherProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const selected = PROFILE_OPTIONS.find(({ id }) => id === value) ?? PROFILE_OPTIONS[0]
    const open = Boolean(anchorEl)

    const handleOpen = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    return (
        <>
            <Button
                id="profile-switcher-button"
                aria-label={label}
                aria-controls={open ? "profile-switcher-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="menu"
                endIcon={<ArrowDropDown />}
                disableRipple
                onClick={handleOpen}
                sx={(theme) => ({
                    minWidth: 0,
                    p: 0,
                    flexShrink: 0,
                    color: theme.palette.text.primary,
                    backgroundColor: "transparent",
                    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
                    fontSize: { xs: "clamp(1.25rem, 6.5vw, 1.75rem)", sm: "2.25rem" },
                    fontWeight: 900,
                    lineHeight: 0.9,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    "& .MuiButton-endIcon": {
                        marginInlineStart: 0.25,
                        marginInlineEnd: -0.25,
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
                {selected.name}
            </Button>
            <Menu
                id="profile-switcher-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    list: { "aria-labelledby": "profile-switcher-button", dense: true },
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
                {PROFILE_OPTIONS.filter(({ id }) => id !== value).map(({ id, name }) => (
                    <MenuItem
                        key={id}
                        component="a"
                        href={hrefForProfile(id)}
                        sx={(theme) => ({
                            px: 1.5,
                            py: 0.75,
                            fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
                            fontSize: "1.2rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            "&:hover, &.Mui-focusVisible": {
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                        })}
                    >
                        {name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

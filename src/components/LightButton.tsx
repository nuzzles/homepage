import React from "react"
import { Button as MuiButton } from "@mui/material"
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button"
import { styled, alpha } from "@mui/material/styles"

export interface LightButtonProps extends Omit<MuiButtonProps, "variant"> {
    /**
     * The variant to use
     */
    variant?: "primary" | "secondary" | "tertiary"
    /**
     * If true, the button is disabled
     */
    disabled?: boolean
    /**
     * The content of the button
     */
    children: React.ReactNode
    /**
     * If true, the button will take up the full width of its container
     */
    fullWidth?: boolean
    /**
     * The size of the button
     */
    size?: "small" | "medium" | "large"
}

// Styled Button with updated variants
const StyledButton = styled(MuiButton)(({ theme }) => {
    return ({ variant, disabled, size }: LightButtonProps) => {
        const getVariantStyles = () => {
            switch (variant) {
                case "secondary":
                    return {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.button,
                        border: `1px solid ${theme.palette.border.main}`,
                        "&:hover": {
                            backgroundColor: theme.palette.background.elevated,
                            border: `1px solid ${theme.palette.common.white}`,
                        },
                        "&:active": {
                            backgroundColor: theme.palette.background.sidebar,
                        },
                    }
                case "tertiary":
                    return {
                        backgroundColor: "transparent",
                        color: theme.palette.text.button,
                        border: "none",
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.text.button, 0.08),
                        },
                        "&:active": {
                            backgroundColor: alpha(theme.palette.text.button, 0.12),
                        },
                    }
                case "primary":
                default:
                    return {
                        backgroundColor: theme.palette.common.white,
                        color: theme.palette.background.default,
                        border: "none",
                        "&:hover": {
                            backgroundColor: theme.palette.text.selected,
                        },
                        "&:active": {
                            backgroundColor: alpha(theme.palette.common.white, 0.88),
                        },
                    }
            }
        }

        const getSizeStyles = () => {
            switch (size) {
                case "small":
                    return {
                        padding: "6px 16px",
                        fontSize: "0.8125rem",
                        minHeight: 36,
                    }
                case "large":
                    return {
                        padding: "16px 32px",
                        fontSize: "0.9375rem",
                        minHeight: 56,
                    }
                case "medium":
                default:
                    return {
                        padding: "12px 24px",
                        fontSize: "0.875rem",
                        minHeight: 48,
                    }
            }
        }

        return {
            ...getVariantStyles(),
            ...getSizeStyles(),
            borderRadius: 0,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",

            "&:focus": {
                outline: `2px solid ${theme.palette.accent.main}`,
                outlineOffset: "2px",
            },

            "&.Mui-disabled": {
                backgroundColor: disabled ? alpha(theme.palette.common.white, 0.3) : "transparent",
                color: disabled ? alpha(theme.palette.background.default, 0.5) : alpha(theme.palette.text.button, 0.5),
                border: variant === "secondary" ? `1px solid ${alpha(theme.palette.border.main, 0.5)}` : "none",
            },

            // Remove default MUI button styles
            "&.MuiButton-root": {
                boxShadow: "none",
                "&:hover": {
                    boxShadow: "none",
                },
            },
        }
    }
})

export const LightButton = ({
    variant = "primary",
    disabled = false,
    fullWidth = false,
    size = "medium",
    children,
    ...props
}: LightButtonProps) => {
    return (
        <StyledButton
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variant={variant as any}
            disabled={disabled}
            fullWidth={fullWidth}
            size={size}
            disableRipple
            {...props}
        >
            {children}
        </StyledButton>
    )
}

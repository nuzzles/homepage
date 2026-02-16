import { Box, IconButton } from "@mui/material"
import { GitHub, LinkedIn } from "@mui/icons-material"

const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/simbleau/", Icon: LinkedIn },
    { label: "GitHub", href: "https://www.github.com/nuzzles/", Icon: GitHub },
] as const

export const SocialLinks = () => {
    return (
        <Box sx={{ display: "inline-flex", gap: 2.5 }}>
            {socials.map(({ label, href, Icon }) => (
                <IconButton
                    key={label}
                    aria-label={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={(theme) => ({
                        width: 64,
                        height: 64,
                        backgroundColor: `${theme.palette.text.primary}14`,
                        transition: "background-color 0.5s",
                        "&:hover": {
                            backgroundColor: `${theme.palette.text.primary}21`,
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: 32,
                            transition: "font-size 0.25s",
                        },
                        "&:hover .MuiSvgIcon-root": {
                            fontSize: 40,
                        },
                    })}
                >
                    <Icon />
                </IconButton>
            ))}
        </Box>
    )
}

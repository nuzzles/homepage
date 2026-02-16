import { Box } from "@mui/material"
import { LinkedIn } from "@mui/icons-material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquareGithub } from "@fortawesome/free-brands-svg-icons"
import { LightButton } from "@/components/LightButton"

const socials = [
    { label: "in/simbleau", href: "https://www.linkedin.com/in/simbleau/", icon: <LinkedIn sx={{ fontSize: "1rem" }} /> },
    {
        label: "@nuzzles",
        href: "https://www.github.com/nuzzles/",
        icon: <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "1rem" }} />,
    },
] as const

export const SocialLinks = () => {
    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {socials.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <LightButton variant="tertiary" size="small" fullWidth>
                        {icon}
                        {label}
                    </LightButton>
                </a>
            ))}
        </Box>
    )
}

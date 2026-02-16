import { Box, Link as MuiLink } from "@mui/material"
import { OpenInNew } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { Link } from "react-router-dom"

const NavItem = styled("li")(({ theme }) => ({
    padding: 0,
    display: "inline-block",
    "& > a": {
        display: "flex",
        padding: "0 10px",
    },
    "& .nav-underline": {
        height: 3,
        width: 0,
        transition: "width 0.2s ease-out",
        backgroundColor: theme.palette.primary.light,
    },
    "&:hover .nav-underline": {
        width: "100%",
    },
}))

export const NavBar = () => {
    return (
        <Box
            component="header"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
            }}
        >
            <Box component="nav">
                <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "inline-flex" }}>
                    <NavItem>
                        <MuiLink component={Link} to="/" underline="none" color="inherit">
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                home
                                <Box className="nav-underline" />
                            </Box>
                        </MuiLink>
                    </NavItem>
                    <NavItem>
                        <MuiLink component={Link} to="/resume" underline="none" color="inherit">
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                résumé
                                <Box className="nav-underline" />
                            </Box>
                        </MuiLink>
                    </NavItem>
                    <NavItem>
                        <MuiLink
                            href="https://nuzzles.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="none"
                            color="inherit"
                            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                blog
                                <Box className="nav-underline" />
                            </Box>
                            <OpenInNew sx={{ fontSize: "0.8rem" }} />
                        </MuiLink>
                    </NavItem>
                </Box>
            </Box>
        </Box>
    )
}

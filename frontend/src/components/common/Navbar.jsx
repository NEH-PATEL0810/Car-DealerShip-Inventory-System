import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully.");
        navigate("/login");
    };

    const isAdmin = user?.is_staff || user?.username === "admin";

    return (
        <AppBar
            position="fixed"
            sx={{
                background: scrolled ? "rgba(24, 27, 34, 0.85)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                boxShadow: scrolled ? "0px 10px 30px rgba(0, 0, 0, 0.4)" : "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 1100,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                    <Typography
                        variant="h5"
                        component={Link}
                        to="/"
                        sx={{
                            textDecoration: "none",
                            color: "white",
                            fontWeight: 800,
                            fontFamily: "'Sora', sans-serif",
                            letterSpacing: "-1px",
                        }}
                    >
                        CarShip
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button color="inherit" component={Link} to="/" sx={{ color: "#B6BDC8", "&:hover": { color: "white" } }}>
                            Home
                        </Button>
                        <Button color="inherit" component={Link} to="/" sx={{ color: "#B6BDC8", "&:hover": { color: "white" } }}>
                            Vehicles
                        </Button>
                        {user && (
                            <>
                                <Button color="inherit" component={Link} to="/" sx={{ color: "#B6BDC8", "&:hover": { color: "white" } }}>
                                    Dashboard
                                </Button>
                                <Button color="inherit" component={Link} to="/profile" sx={{ color: "#B6BDC8", "&:hover": { color: "white" } }}>
                                    Profile
                                </Button>
                                {isAdmin && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        component={Link}
                                        to="/admin"
                                        sx={{
                                            ml: 1,
                                            borderWidth: "1.5px",
                                            "&:hover": { borderWidth: "1.5px" }
                                        }}
                                    >
                                        Admin Portal
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleLogout}
                                    sx={{
                                        ml: 1,
                                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                                        border: "1px solid rgba(239, 68, 68, 0.2)",
                                        color: "#EF4444",
                                        "&:hover": {
                                            backgroundColor: "#EF4444",
                                            color: "white",
                                        }
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                        {!user && (
                            <>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to="/login"
                                    sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)", "&:hover": { borderColor: "white" } }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="/register"
                                    sx={{ backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#2563EB" } }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;

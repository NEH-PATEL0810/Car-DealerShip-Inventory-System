import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(() => {
        return localStorage.getItem("profile_photo") || "";
    });

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

    useEffect(() => {
        const handleProfileUpdate = () => {
            setAvatarUrl(localStorage.getItem("profile_photo") || "");
        };
        handleProfileUpdate();
        window.addEventListener("profile-updated", handleProfileUpdate);
        return () => window.removeEventListener("profile-updated", handleProfileUpdate);
    }, [user]);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully.");
        navigate("/login");
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
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
                                <Avatar
                                    src={avatarUrl}
                                    alt={user.username}
                                    component={Link}
                                    to="/profile"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        ml: 1.5,
                                        mr: 0.5,
                                        border: "1.5px solid #3B82F6",
                                        cursor: "pointer",
                                        backgroundColor: "#1E222B",
                                        fontSize: "0.9rem",
                                        fontWeight: 700,
                                        color: "white",
                                        textDecoration: "none"
                                    }}
                                >
                                    {user.username?.charAt(0).toUpperCase()}
                                </Avatar>
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

                    {/* Mobile Navigation */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
                        <IconButton
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuOpen}
                            sx={{ color: "#B6BDC8", "&:hover": { color: "white" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    backgroundColor: "#181B22",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    borderRadius: "12px",
                                    mt: 1.5,
                                    minWidth: 180,
                                }
                            }}
                        >
                            {user && (
                                <Box
                                    component={Link}
                                    to="/profile"
                                    onClick={handleMenuClose}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                                        mb: 1,
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.03)"
                                        }
                                    }}
                                >
                                    <Avatar
                                        src={avatarUrl}
                                        alt={user.username}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            border: "1.5px solid #3B82F6",
                                            backgroundColor: "#1E222B",
                                            fontSize: "0.9rem",
                                            fontWeight: 700,
                                            color: "white"
                                        }}
                                    >
                                        {user.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body2" color="white" fontWeight={600}>
                                        {user.username}
                                    </Typography>
                                </Box>
                            )}
                            <MenuItem onClick={handleMenuClose} component={Link} to="/" sx={{ color: "#B6BDC8" }}>
                                Home
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/" sx={{ color: "#B6BDC8" }}>
                                Vehicles
                            </MenuItem>
                            {user && [
                                <MenuItem key="dash" onClick={handleMenuClose} component={Link} to="/" sx={{ color: "#B6BDC8" }}>
                                    Dashboard
                                </MenuItem>,
                                isAdmin && (
                                    <MenuItem key="admin" onClick={handleMenuClose} component={Link} to="/admin" sx={{ color: "#3B82F6", fontWeight: 600 }}>
                                        Admin Portal
                                    </MenuItem>
                                ),
                                <MenuItem key="logout" onClick={() => { handleMenuClose(); handleLogout(); }} sx={{ color: "#EF4444" }}>
                                    Logout
                                </MenuItem>
                            ]}
                            {!user && [
                                <MenuItem key="login" onClick={handleMenuClose} component={Link} to="/login" sx={{ color: "#B6BDC8" }}>
                                    Sign In
                                </MenuItem>,
                                <MenuItem key="register" onClick={handleMenuClose} component={Link} to="/register" sx={{ color: "#3B82F6", fontWeight: 600 }}>
                                    Register
                                </MenuItem>
                            ]}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;

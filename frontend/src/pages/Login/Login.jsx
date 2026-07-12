import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Grid,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { getErrorMessage } from "../../utils/errorParser";
import toast from "react-hot-toast";

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser({ username, password });
            login(data.tokens, data.user);
            toast.success(data.message || "Welcome back to CarShip.");
            navigate("/");
        } catch (err) {
            const errMsg = getErrorMessage(err, "Invalid credentials.");
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container sx={{ minHeight: "100vh", backgroundColor: "#0F1115" }}>
            {/* Left side: Premium Image Banner */}
            <Grid
                size={{ xs: 0, md: 7 }}
                sx={{
                    position: "relative",
                    backgroundImage: "url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 6,
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to top, rgba(15,17,21,0.95) 0%, rgba(15,17,21,0.2) 100%)",
                        zIndex: 1,
                    },
                }}
            >
                <Box sx={{ zIndex: 2, position: "relative" }}>
                    <Typography variant="h2" color="white" gutterBottom sx={{ fontWeight: 800, textShadow: "0px 4px 20px rgba(0,0,0,0.6)" }}>
                        Performance is in the details.
                    </Typography>
                    <Typography variant="h6" color="#B6BDC8" sx={{ maxWidth: 500, fontWeight: 300 }}>
                        Step into our virtual showroom and manage your premium fleet with cutting edge tools.
                    </Typography>
                </Box>
            </Grid>

            {/* Right side: Modern Glassmorphic Login Form */}
            <Grid
                size={{ xs: 12, md: 5 }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        width: "100%",
                        maxWidth: 450,
                        backgroundColor: "#181B22",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow: "0px 40px 80px rgba(0,0,0,0.6)",
                        borderRadius: 6,
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" color="white" gutterBottom sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}>
                            CarShip
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Welcome back. Please sign in to continue.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Typography variant="body2" color="white" sx={{ mb: 1, fontWeight: 500 }}>
                            Username
                        </Typography>
                        <TextField
                            required
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 3 }}
                        />

                        <Typography variant="body2" color="white" sx={{ mb: 1, fontWeight: 500 }}>
                            Password
                        </Typography>
                        <TextField
                            required
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 4 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                py: 1.8,
                                fontWeight: 700,
                                fontSize: "1rem",
                                borderRadius: 4,
                                backgroundColor: "#3B82F6",
                                "&:hover": {
                                    backgroundColor: "#2563EB",
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                        </Button>

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                New to CarShip?{" "}
                                <Link
                                    to="/register"
                                    style={{
                                        textDecoration: "none",
                                        color: "#3B82F6",
                                        fontWeight: 600,
                                    }}
                                >
                                    Create account
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Login;

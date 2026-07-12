import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#3B82F6", // Primary blue
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#22C55E", // Success green accent
            contrastText: "#FFFFFF",
        },
        error: {
            main: "#EF4444", // Danger red
        },
        warning: {
            main: "#F59E0B", // Warning orange
        },
        background: {
            default: "#0F1115", // Primary dark background
            paper: "#1E222B", // Card/Modal background
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#B6BDC8",
        },
        divider: "rgba(255,255,255,0.08)",
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
        h1: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
        },
        h2: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
        },
        h3: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
        },
        h4: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
        },
        h5: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
        },
        h6: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
        },
        subtitle1: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
        },
        subtitle2: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
        },
        body1: {
            fontFamily: "'Poppins', sans-serif",
        },
        body2: {
            fontFamily: "'Poppins', sans-serif",
        },
        button: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            textTransform: "none",
        },
    },
    shape: {
        borderRadius: 20, // Large rounded corners (20px)
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 24, // Circular buttons
                    padding: "8px 24px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(59,130,246,0.3)",
                    },
                },
                containedSecondary: {
                    "&:hover": {
                        boxShadow: "0 8px 20px rgba(34,197,94,0.3)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.5)",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 16,
                        backgroundColor: "#181B22",
                        "& fieldset": {
                            borderColor: "rgba(255,255,255,0.08)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#3B82F6",
                        },
                    },
                },
            },
        },
    },
});

export default theme;

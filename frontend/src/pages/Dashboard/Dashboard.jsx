import React, { useState, useEffect, useContext } from "react";
import {
    Container,
    Grid,
    Typography,
    Button,
    Box,
    Card,
    CardMedia,
    CardContent,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    CircularProgress,
    Stack,
    Slider,
    Paper,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { searchVehicles, purchaseVehicle } from "../../services/vehicleService";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorParser";

// Helper for vehicle images based on category
const getCarImage = (category) => {
    const images = {
        SUV: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop",
        Sedan: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop",
        Hatchback: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=600&auto=format&fit=crop",
        Truck: "https://images.unsplash.com/photo-1533519083849-0d28362d2950?q=80&w=600&auto=format&fit=crop",
        Luxury: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop",
    };
    return images[category] || images["Luxury"];
};

// Sleek Custom SVG Icons
const Icons = {
    Star: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Heart: ({ filled }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "#B6BDC8"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    ),
    Fuel: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B6BDC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 22V2h10v20M13 6h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6M13 12h8M6 6h4" />
        </svg>
    ),
    Transmission: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B6BDC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
        </svg>
    ),
};

const HERO_SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop",
        heading: "Find Your",
        accent: "Dream Car.",
        subtitle: "Browse premium vehicles from trusted dealerships with real-time inventory and seamless transaction handling.",
        stats: [
            { label: "Available Cars", value: "150+" },
            { label: "Customers", value: "5k+" },
            { label: "Vehicles Sold", value: "12k+" },
            { label: "Rating", value: "4.9 ★" }
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop",
        heading: "Experience",
        accent: "Luxury Supercars.",
        subtitle: "Unleash high performance with our handpicked collection of exotic racing imports and modern sports coupes.",
        stats: [
            { label: "Top Speed", value: "205 mph" },
            { label: "0-60 mph", value: "3.5s" },
            { label: "Horsepower", value: "503 hp" },
            { label: "Gearbox", value: "8-Speed" }
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop",
        heading: "Explore",
        accent: "Premium SUVs.",
        subtitle: "Go anywhere in absolute comfort. Discover top-rated luxury utility vehicles optimized for all-terrain capability.",
        stats: [
            { label: "Towing Cap.", value: "7,716 lbs" },
            { label: "Ground Cl.", value: "11.1 in" },
            { label: "Cargo Space", value: "78.8 cu ft" },
            { label: "Drivetrain", value: "AWD" }
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop",
        heading: "Precision",
        accent: "German Power.",
        subtitle: "Sleek contours, intelligent cockpits, and exhilarating performance engineering await you in our fleet.",
        stats: [
            { label: "Engine Type", value: "V8 Twin-Turbo" },
            { label: "0-60 mph", value: "3.0s" },
            { label: "Acceleration", value: "Exhilarating" },
            { label: "Rating", value: "4.8 ★" }
        ]
    }
];

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Filter states
    const [search, setSearch] = useState("");
    const [make, setMake] = useState("");
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    // Purchase Dialog state
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [purchaseQty, setPurchaseQty] = useState(1);
    const [purchasing, setPurchasing] = useState(false);
    const [successDialog, setSuccessDialog] = useState(false);

    const fetchFilteredVehicles = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.model = search;
            if (make) params.make = make;
            if (category) params.category = category;
            if (priceRange[0] > 0) params.min_price = priceRange[0];
            if (priceRange[1] < 10000000) params.max_price = priceRange[1];

            const data = await searchVehicles(params);
            setVehicles(data.data || []);
        } catch (err) {
            toast.error("Failed to load inventory.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFilteredVehicles();
        }
    }, [search, make, category, priceRange, user]);

    const handleReset = () => {
        setSearch("");
        setMake("");
        setCategory("");
        setPriceRange([0, 10000000]);
        toast.success("Filters reset.");
    };

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
        toast.success(favorites[id] ? "Removed from Favorites" : "Added to Favorites");
    };

    const handleOpenPurchase = (vehicle) => {
        if (!user) {
            toast.error("Please sign in to purchase vehicles.");
            return;
        }
        setSelectedVehicle(vehicle);
        setPurchaseQty(1);
    };

    const handleConfirmPurchase = async () => {
        setPurchasing(true);
        try {
            // Purchase call (since backend purchase handles one item per call currently)
            const data = await purchaseVehicle(selectedVehicle.id);
            toast.success(data.message || "Purchase completed!");
            setSelectedVehicle(null);
            setSuccessDialog(true);
            fetchFilteredVehicles();
        } catch (err) {
            toast.error(getErrorMessage(err, "Purchase failed."));
        } finally {
            setPurchasing(false);
        }
    };

    // Calculate unique makes for filter dropdown
    const uniqueMakes = ["Toyota", "Honda", "BMW", "Audi", "Ford", "Mercedes-Benz", "Hyundai", "Tesla"];

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#0F1115", pb: 10 }}>
            {/* HERO SECTION */}
            <Box
                sx={{
                    position: "relative",
                    minHeight: "85vh",
                    backgroundImage: "radial-gradient(circle at 80% 40%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 17, 21, 0) 50%)",
                    display: "flex",
                    alignItems: "center",
                    pt: { xs: 8, md: 0 },
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={6} sx={{ alignItems: "center" }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ minHeight: { xs: "auto", md: "170px" } }}>
                                <Typography
                                    variant="h1"
                                    color="white"
                                    sx={{
                                        fontSize: { xs: "2.8rem", md: "4.5rem" },
                                        lineHeight: 1.1,
                                        mb: 3,
                                        letterSpacing: "-2px",
                                        transition: "all 0.5s ease-in-out",
                                    }}
                                >
                                    {HERO_SLIDES[currentSlide].heading} <br />
                                    <span style={{ color: "#3B82F6" }}>{HERO_SLIDES[currentSlide].accent}</span>
                                </Typography>
                            </Box>
                            <Typography 
                                variant="h6" 
                                color="#B6BDC8" 
                                sx={{ 
                                    fontWeight: 300, 
                                    mb: 5, 
                                    maxWidth: 500, 
                                    lineHeight: 1.6,
                                    minHeight: { xs: "auto", md: "80px" },
                                    transition: "all 0.5s ease-in-out",
                                }}
                            >
                                {HERO_SLIDES[currentSlide].subtitle}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => document.getElementById("collection-section").scrollIntoView({ behavior: "smooth" })}
                                    sx={{ px: 4, py: 1.8, fontSize: "1rem", backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#2563EB" } }}
                                >
                                    Browse Cars
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{ px: 4, py: 1.8, fontSize: "1rem", color: "white", borderColor: "rgba(255,255,255,0.2)", "&:hover": { borderColor: "white" } }}
                                >
                                    Explore Collection
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} sx={{ position: "relative" }}>
                            {/* Automated Showroom Slideshow */}
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    pt: "60%", // Maintains aspect ratio
                                    borderRadius: "24px",
                                    overflow: "hidden",
                                    boxShadow: "0px 30px 60px rgba(0,0,0,0.8)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    mb: 4,
                                }}
                            >
                                {HERO_SLIDES.map((slide, index) => {
                                    const active = index === currentSlide;
                                    return (
                                        <Box
                                            key={index}
                                            component="img"
                                            src={slide.image}
                                            alt={slide.title}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                opacity: active ? 1 : 0,
                                                transform: active ? "scale(1)" : "scale(1.05)",
                                                transition: "opacity 1s ease-in-out, transform 1s ease-in-out",
                                                zIndex: active ? 2 : 1,
                                            }}
                                        />
                                    );
                                })}

                                {/* Pagination Dots Overlay */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 20,
                                        right: 20,
                                        zIndex: 10,
                                        display: "flex",
                                        gap: 1,
                                    }}
                                >
                                    {HERO_SLIDES.map((_, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            sx={{
                                                width: index === currentSlide ? 24 : 8,
                                                height: 8,
                                                borderRadius: "4px",
                                                backgroundColor: index === currentSlide ? "#3B82F6" : "rgba(255,255,255,0.4)",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Floating Glass Stats Panel */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: "-35px",
                                    left: "5%",
                                    right: "5%",
                                    background: "rgba(24, 27, 34, 0.85)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    borderRadius: "20px",
                                    p: 3,
                                    boxShadow: "0px 30px 60px rgba(0,0,0,0.6)",
                                    zIndex: 5,
                                }}
                            >
                                <Grid container spacing={2} sx={{ justifyContent: "space-around" }}>
                                    {HERO_SLIDES[currentSlide].stats.map((stat, i) => (
                                        <Box key={i} sx={{ textAlign: "center" }}>
                                            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="caption" color="#B6BDC8">
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* COLLECTION SECTION */}
            <Container maxWidth="xl" id="collection-section" sx={{ mt: 15 }}>
                {user ? (
                    <>
                        {/* Search / Filtering Block */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                mb: 6,
                                backgroundColor: "#181B22",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "24px",
                                boxShadow: "0px 30px 60px rgba(0,0,0,0.5)",
                            }}
                        >
                            <Typography variant="h5" color="white" sx={{ mb: 3 }}>
                                Search & Filter Fleet
                            </Typography>
                            <Grid container spacing={3} sx={{ alignItems: "center" }}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Search keyword (model)"
                                        placeholder="e.g. Fortuner, City"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        select
                                        label="Brand"
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                    >
                                        <MenuItem value="">All Brands</MenuItem>
                                        {uniqueMakes.map(m => (
                                            <MenuItem key={m} value={m}>{m}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        select
                                        label="Category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        <MenuItem value="SUV">SUV</MenuItem>
                                        <MenuItem value="Sedan">Sedan</MenuItem>
                                        <MenuItem value="Hatchback">Hatchback</MenuItem>
                                        <MenuItem value="Truck">Truck</MenuItem>
                                        <MenuItem value="Luxury">Luxury</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }} sx={{ px: 2 }}>
                                    <Typography variant="caption" color="#B6BDC8" sx={{ mb: 1, display: "block" }}>
                                        Price Range ($0 - $10,000,000)
                                    </Typography>
                                    <Slider
                                        value={priceRange}
                                        onChange={(e, newValue) => setPriceRange(newValue)}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={10000000}
                                        step={100000}
                                        sx={{ color: "#3B82F6" }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        onClick={handleReset}
                                        sx={{ py: 1.2, borderRadius: 3, border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444" }}
                                    >
                                        Reset Filters
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* VEHICLES FLEET GRID */}
                        {loading ? (
                            <Box display="flex" justifyContent="center" py={10}>
                                <CircularProgress size={50} color="primary" />
                            </Box>
                        ) : vehicles.length === 0 ? (
                            <Box textAlign="center" py={8}>
                                <Typography variant="h6" color="#B6BDC8">
                                    No vehicles matching your current filters. Try resetting the criteria.
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={4}>
                                {vehicles.map((car) => {
                                    const isOutOfStock = car.quantity <= 0;
                                    return (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={car.id}>
                                            <Card
                                                sx={{
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    backgroundColor: "#1E222B",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "20px",
                                                    overflow: "hidden",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    "&:hover": {
                                                        transform: "translateY(-10px)",
                                                        boxShadow: "0px 30px 60px rgba(0, 0, 0, 0.6)",
                                                        "& .car-img": {
                                                            transform: "scale(1.08)",
                                                        }
                                                    }
                                                }}
                                            >
                                                <Box sx={{ position: "relative", overflow: "hidden" }}>
                                                    <CardMedia
                                                        className="car-img"
                                                        component="img"
                                                        height="220"
                                                        image={getCarImage(car.category)}
                                                        alt={`${car.make} ${car.model}`}
                                                        sx={{
                                                            transition: "transform 0.5s ease",
                                                        }}
                                                    />
                                                    {/* Status Badge */}
                                                    <Box sx={{ position: "absolute", top: 15, left: 15, zIndex: 3 }}>
                                                        {isOutOfStock ? (
                                                            <Chip label="Out of Stock" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
                                                        ) : (
                                                            <Chip label={`${car.quantity} Available`} color="success" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
                                                        )}
                                                    </Box>
                                                    {/* Category Badge */}
                                                    <Box sx={{ position: "absolute", top: 15, right: 15, zIndex: 3 }}>
                                                        <Chip label={car.category} size="small" sx={{ background: "rgba(15,17,21,0.75)", color: "white", backdropFilter: "blur(5px)", fontWeight: 600, borderRadius: 2 }} />
                                                    </Box>
                                                </Box>

                                                <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column" }}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                                        <Box>
                                                            <Typography variant="body2" color="#B6BDC8" sx={{ letterSpacing: 0.5 }}>
                                                                {car.make}
                                                            </Typography>
                                                            <Typography variant="h6" color="white" sx={{ fontWeight: 700, mt: 0.2 }}>
                                                                {car.model}
                                                            </Typography>
                                                        </Box>
                                                        <IconButton onClick={() => toggleFavorite(car.id)} sx={{ p: 0.5 }}>
                                                            <Icons.Heart filled={favorites[car.id]} />
                                                        </IconButton>
                                                    </Box>

                                                    {/* Spec Row */}
                                                    <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <Icons.Fuel />
                                                            <Typography variant="caption" color="#B6BDC8">Petrol</Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <Icons.Transmission />
                                                            <Typography variant="caption" color="#B6BDC8">Auto</Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <Icons.Star />
                                                            <Typography variant="caption" color="white" fontWeight={600}>4.8</Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: "auto", pt: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                                        <Typography variant="h5" color="white" sx={{ fontWeight: 800 }}>
                                                            ${parseFloat(car.price).toLocaleString()}
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            disabled={isOutOfStock}
                                                            onClick={() => handleOpenPurchase(car)}
                                                            sx={{
                                                                backgroundColor: isOutOfStock ? "rgba(255,255,255,0.04)" : "#3B82F6",
                                                                px: 3,
                                                            }}
                                                        >
                                                            Buy Now
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            textAlign: "center",
                            backgroundColor: "#181B22",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "24px",
                            boxShadow: "0px 30px 60px rgba(0,0,0,0.5)",
                            maxWidth: 700,
                            margin: "0 auto",
                        }}
                    >
                        <Typography variant="h4" color="white" align="center" sx={{ fontWeight: 800, mb: 2 }}>
                            Unlock Our Showroom
                        </Typography>
                        <Typography variant="body1" color="#B6BDC8" align="center" sx={{ mb: 4, maxWidth: 500, margin: "0 auto 30px", lineHeight: 1.6 }}>
                            Our exclusive collection of premium high-performance vehicles is reserved for registered members. Create an account or sign in to browse active inventory, pricing details, and request delivery.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to="/login"
                                sx={{ px: 4, py: 1.5, backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#2563EB" } }}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/register"
                                sx={{ px: 4, py: 1.5, color: "white", borderColor: "rgba(255,255,255,0.2)", "&:hover": { borderColor: "white" } }}
                            >
                                Register
                            </Button>
                        </Stack>
                    </Paper>
                )}
            </Container>

            {/* PURCHASE TRANSACTION DIALOG */}
            <Dialog
                open={Boolean(selectedVehicle)}
                onClose={() => setSelectedVehicle(null)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#181B22",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        width: "100%",
                        maxWidth: 450,
                    }
                }}
            >
                {selectedVehicle && (
                    <>
                        <DialogTitle sx={{ color: "white", fontWeight: 700, pb: 1 }}>
                            Confirm Fleet Purchase
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ position: "relative", mb: 3, borderRadius: "12px", overflow: "hidden" }}>
                                <img
                                    src={getCarImage(selectedVehicle.category)}
                                    alt={selectedVehicle.model}
                                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                                />
                                <Box sx={{ position: "absolute", bottom: 10, left: 10 }}>
                                    <Chip label={selectedVehicle.category} size="small" sx={{ background: "rgba(0,0,0,0.7)" }} />
                                </Box>
                            </Box>
                            <Typography variant="h6" color="white" sx={{ fontWeight: 700 }}>
                                {selectedVehicle.make} {selectedVehicle.model}
                            </Typography>
                            <Typography variant="body2" color="#B6BDC8" gutterBottom>
                                Secure your order placement below.
                            </Typography>

                            <Box sx={{ mt: 3, p: 2, borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="#B6BDC8">Price per unit</Typography>
                                    <Typography variant="body2" color="white" fontWeight={600}>
                                        ${parseFloat(selectedVehicle.price).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" sx={{ pt: 1, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                    <Typography variant="body1" color="white" fontWeight={700}>Total Due</Typography>
                                    <Typography variant="body1" color="#3B82F6" fontWeight={800}>
                                        ${parseFloat(selectedVehicle.price).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button
                                onClick={() => setSelectedVehicle(null)}
                                sx={{ color: "#B6BDC8", "&:hover": { color: "white" } }}
                                disabled={purchasing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleConfirmPurchase}
                                disabled={purchasing}
                                sx={{
                                    px: 4,
                                    backgroundColor: "#3B82F6",
                                    "&:hover": { backgroundColor: "#2563EB" },
                                }}
                            >
                                {purchasing ? <CircularProgress size={20} color="inherit" /> : "Purchase Vehicle"}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* SUCCESS MODAL */}
            <Dialog
                open={successDialog}
                onClose={() => setSuccessDialog(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#181B22",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        textAlign: "center",
                        p: 4,
                        maxWidth: 400,
                    }
                }}
            >
                <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: "rgba(34, 197, 94, 0.1)",
                            border: "2px solid #22C55E",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </Box>
                </Box>
                <DialogTitle sx={{ color: "white", fontWeight: 800, p: 0, textAlign: "center" }}>
                    Order Confirmed!
                </DialogTitle>
                <DialogContent sx={{ p: 0, mt: 1, mb: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="#B6BDC8" align="center">
                        Your transaction was processed successfully. Our sales reps will reach out shortly for delivery scheduling.
                    </Typography>
                </DialogContent>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setSuccessDialog(false)}
                    sx={{ backgroundColor: "#22C55E", "&:hover": { backgroundColor: "#16A34A" }, py: 1.2 }}
                >
                    Close Window
                </Button>
            </Dialog>
        </Box>
    );
}

export default Dashboard;

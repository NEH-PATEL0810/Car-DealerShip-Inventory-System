import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Button,
    Grid,
    TextField,
    Divider,
    Stack,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { getUserPurchases } from "../../services/vehicleService";
import toast from "react-hot-toast";

const getCarImage = (category) => {
    const images = {
        SUV: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=300&auto=format&fit=crop",
        Sedan: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300&auto=format&fit=crop",
        Hatchback: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=300&auto=format&fit=crop",
        Truck: "https://images.unsplash.com/photo-1533519083849-0d28362d2950?q=80&w=300&auto=format&fit=crop",
        Luxury: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=300&auto=format&fit=crop",
    };
    return images[category] || images["Luxury"];
};

function Profile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [avatarUrl, setAvatarUrl] = useState(() => {
        return localStorage.getItem("profile_photo") || "";
    });

    const [editMode, setEditMode] = useState(false);
    const [displayName, setDisplayName] = useState(() => {
        return localStorage.getItem("display_name") || user?.username || "";
    });
    const [purchases, setPurchases] = useState([]);
    const [purchasesLoading, setPurchasesLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            toast.error("Please sign in to view your profile.");
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            const fetchPurchases = async () => {
                try {
                    const data = await getUserPurchases();
                    setPurchases(data.data || []);
                } catch (err) {
                    toast.error("Failed to load purchase history.");
                } finally {
                    setPurchasesLoading(false);
                }
            };
            fetchPurchases();
        }
    }, [user]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation for image file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        // Limit size to 2MB to keep it safe for localStorage storage
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result;
            localStorage.setItem("profile_photo", base64Data);
            setAvatarUrl(base64Data);
            toast.success("Profile photo updated successfully!");
            window.dispatchEvent(new Event("profile-updated"));
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        localStorage.removeItem("profile_photo");
        setAvatarUrl("");
        toast.success("Profile photo removed.");
        window.dispatchEvent(new Event("profile-updated"));
    };

    const handleSaveProfile = () => {
        localStorage.setItem("display_name", displayName);
        setEditMode(false);
        toast.success("Profile details saved successfully.");
    };

    if (!user) return null;

    const isAdmin = user.is_staff || user.username === "admin";

    return (
        <Box sx={{ minHeight: "90vh", backgroundColor: "#0F1115", py: 8 }}>
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        backgroundColor: "#181B22",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "24px",
                        boxShadow: "0px 30px 60px rgba(0,0,0,0.5)",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4, width: "100%" }}>
                        <Typography variant="h4" color="white" align="center" sx={{ fontWeight: 800, mb: 1, fontFamily: "'Sora', sans-serif" }}>
                            Your CarShip Profile
                        </Typography>
                        <Typography variant="body2" color="#B6BDC8" align="center">
                            Manage your profile details and showroom preferences.
                        </Typography>
                    </Box>

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 5 }} />

                    <Grid container spacing={5}>
                        {/* Left: Avatar Upload / Edit */}
                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Avatar
                                src={avatarUrl}
                                alt={user.username}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    mb: 3,
                                    border: "3px solid #3B82F6",
                                    fontSize: "3rem",
                                    fontWeight: 700,
                                    backgroundColor: "#1E222B",
                                }}
                            >
                                {user.username?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Stack spacing={2} width="100%">
                                <Button
                                    variant="contained"
                                    component="label"
                                    color="primary"
                                    sx={{ py: 1, backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#2563EB" } }}
                                >
                                    Upload Photo
                                    <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
                                </Button>
                                {avatarUrl && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleRemovePhoto}
                                        sx={{
                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                            color: "#EF4444",
                                            "&:hover": { borderColor: "#EF4444", backgroundColor: "rgba(239,68,68,0.05)" }
                                        }}
                                    >
                                        Remove Photo
                                    </Button>
                                )}
                            </Stack>
                        </Grid>

                        {/* Right: User Information */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="caption" color="#B6BDC8" sx={{ letterSpacing: 0.5, textTransform: "uppercase" }}>
                                        User Tier & Privileges
                                    </Typography>
                                    <Typography variant="h6" color={isAdmin ? "#EF4444" : "#3B82F6"} sx={{ fontWeight: 700, mt: 0.5 }}>
                                        {isAdmin ? "Dealership Administrator" : "Exclusive Showroom Member"}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="white" sx={{ mb: 1, fontWeight: 500 }}>
                                        Showroom Username
                                    </Typography>
                                    <TextField
                                        disabled
                                        value={user.username}
                                        helperText="Username is fixed for authentication records."
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="white" sx={{ mb: 1, fontWeight: 500 }}>
                                        Email Address
                                    </Typography>
                                    <TextField
                                        disabled
                                        value={user.email || "No email linked"}
                                        helperText="Linked email address verified by system auth."
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="white" sx={{ mb: 1, fontWeight: 500 }}>
                                        Display Name (Nickname)
                                    </Typography>
                                    {editMode ? (
                                        <TextField
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Enter nickname"
                                        />
                                    ) : (
                                        <TextField
                                            disabled
                                            value={displayName || "Not configured"}
                                        />
                                    )}
                                </Box>

                                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 2 }}>
                                    {editMode ? (
                                        <>
                                            <Button onClick={() => setEditMode(false)} sx={{ color: "#B6BDC8" }}>
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleSaveProfile}
                                                sx={{ backgroundColor: "#22C55E", "&:hover": { backgroundColor: "#16A34A" } }}
                                            >
                                                Save Details
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            onClick={() => setEditMode(true)}
                                            sx={{ color: "#3B82F6", borderColor: "rgba(59,130,246,0.3)" }}
                                        >
                                            Edit Display Name
                                        </Button>
                                    )}
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 5 }} />

                    {/* Order History Section */}
                    <Box>
                        <Typography variant="h5" color="white" sx={{ fontWeight: 800, mb: 3, fontFamily: "'Sora', sans-serif" }}>
                            Purchased Vehicles History
                        </Typography>
                        {purchasesLoading ? (
                            <Typography variant="body2" color="#B6BDC8">Loading order history...</Typography>
                        ) : purchases.length === 0 ? (
                            <Typography variant="body2" color="#B6BDC8">No vehicle purchases recorded yet.</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {purchases.map((purchase) => (
                                    <Box
                                        key={purchase.id}
                                        sx={{
                                            p: 2,
                                            borderRadius: "16px",
                                            backgroundColor: "#1E222B",
                                            border: "1px solid rgba(255,255,255,0.04)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 3,
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Box
                                                component="img"
                                                src={getCarImage(purchase.vehicle?.category)}
                                                alt={purchase.vehicle?.model}
                                                sx={{ width: 80, height: 50, borderRadius: "8px", objectFit: "cover" }}
                                            />
                                            <Box>
                                                <Typography variant="body1" color="white" fontWeight={700}>
                                                    {purchase.vehicle?.make} {purchase.vehicle?.model}
                                                </Typography>
                                                <Typography variant="caption" color="#B6BDC8">
                                                    Category: {purchase.vehicle?.category} | Ordered on {new Date(purchase.purchased_at).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography variant="h6" color="#22C55E" fontWeight={800}>
                                                ${parseFloat(purchase.price_paid).toLocaleString()}
                                            </Typography>
                                            <Typography variant="caption" color="#B6BDC8">
                                                Paid via Dealer Financing
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Profile;

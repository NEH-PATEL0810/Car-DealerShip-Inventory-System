import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Grid,
    Typography,
    Button,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    restockVehicle,
} from "../../services/vehicleService";
import toast from "react-hot-toast";

// Helper for images
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

// Sleek Custom SVG Icons
const Icons = {
    Dashboard: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
        </svg>
    ),
    Inventory: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    ),
    Add: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    Edit: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    Delete: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    ),
};

function Admin() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarTab, setSidebarTab] = useState("inventory");

    // Form Dialog states
    const [formOpen, setFormOpen] = useState(false);
    const [editVehicle, setEditVehicle] = useState(null);
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [category, setCategory] = useState("SUV");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [saving, setSaving] = useState(false);

    // Delete Dialog states
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Restock Dialog states
    const [restockOpen, setRestockOpen] = useState(false);
    const [vehicleToRestock, setVehicleToRestock] = useState(null);
    const [restockQty, setRestockQty] = useState("");
    const [restocking, setRestocking] = useState(false);

    useEffect(() => {
        // Enforce admin permission
        const isAdmin = user?.is_staff || user?.username === "admin";
        if (!user || !isAdmin) {
            toast.error("Access denied. Admin portal only.");
            navigate("/");
            return;
        }
        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const data = await getVehicles();
            setVehicles(data.data || []);
        } catch (err) {
            toast.error("Failed to fetch fleet inventory.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditVehicle(null);
        setMake("");
        setModel("");
        setCategory("SUV");
        setPrice("");
        setQuantity("");
        setFormOpen(true);
    };

    const handleOpenEdit = (car) => {
        setEditVehicle(car);
        setMake(car.make);
        setModel(car.model);
        setCategory(car.category);
        setPrice(car.price);
        setQuantity(car.quantity);
        setFormOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!make || !model || !price || quantity === "") {
            toast.error("Please fill in all fields.");
            return;
        }

        const payload = {
            make,
            model,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
        };

        setSaving(true);
        try {
            if (editVehicle) {
                await updateVehicle(editVehicle.id, payload);
                toast.success("Vehicle updated successfully.");
            } else {
                await createVehicle(payload);
                toast.success("Vehicle added to inventory.");
            }
            setFormOpen(false);
            fetchAdminData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save vehicle details.");
        } finally {
            setSaving(false);
        }
    };

    const handleOpenDelete = (car) => {
        setVehicleToDelete(car);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteVehicle(vehicleToDelete.id);
            toast.success("Vehicle deleted successfully.");
            setDeleteOpen(false);
            fetchAdminData();
        } catch (err) {
            toast.error("Failed to delete vehicle.");
        } finally {
            setDeleting(false);
        }
    };

    const handleOpenRestock = (car) => {
        setVehicleToRestock(car);
        setRestockQty("");
        setRestockOpen(true);
    };

    const handleRestock = async (e) => {
        e.preventDefault();
        const qty = parseInt(restockQty);
        if (isNaN(qty) || qty <= 0) {
            toast.error("Please enter a valid quantity greater than zero.");
            return;
        }

        setRestocking(true);
        try {
            await restockVehicle(vehicleToRestock.id, qty);
            toast.success("Vehicle restocked successfully.");
            setRestockOpen(false);
            fetchAdminData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Restock failed.");
        } finally {
            setRestocking(false);
        }
    };

    // Metrics calculation
    const totalFleet = vehicles.length;
    const availableFleet = vehicles.filter(v => v.quantity > 0).length;
    const outOfStockFleet = vehicles.filter(v => v.quantity <= 0).length;
    const totalAssets = vehicles.reduce((sum, v) => sum + (parseFloat(v.price) * v.quantity), 0);

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#0F1115", display: "flex" }}>
            {/* ADMIN LEFT SIDEBAR */}
            <Box
                sx={{
                    width: 260,
                    backgroundColor: "#181B22",
                    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    p: 3,
                    position: "fixed",
                    top: 70,
                    bottom: 0,
                    left: 0,
                }}
            >
                <Typography variant="body2" color="#B6BDC8" sx={{ fontWeight: 600, mb: 3, letterSpacing: 1 }}>
                    MANAGEMENT
                </Typography>
                <Stack spacing={1}>
                    <Button
                        variant={sidebarTab === "dashboard" ? "contained" : "text"}
                        onClick={() => setSidebarTab("dashboard")}
                        startIcon={<Icons.Dashboard />}
                        sx={{
                            justifyContent: "flex-start",
                            color: sidebarTab === "dashboard" ? "white" : "#B6BDC8",
                            backgroundColor: sidebarTab === "dashboard" ? "#3B82F6" : "transparent",
                            py: 1.5,
                        }}
                    >
                        Analytics
                    </Button>
                    <Button
                        variant={sidebarTab === "inventory" ? "contained" : "text"}
                        onClick={() => setSidebarTab("inventory")}
                        startIcon={<Icons.Inventory />}
                        sx={{
                            justifyContent: "flex-start",
                            color: sidebarTab === "inventory" ? "white" : "#B6BDC8",
                            backgroundColor: sidebarTab === "inventory" ? "#3B82F6" : "transparent",
                            py: 1.5,
                        }}
                    >
                        Fleet Inventory
                    </Button>
                </Stack>
            </Box>

            {/* MAIN CONTENT AREA */}
            <Box
                sx={{
                    flexGrow: 1,
                    ml: { xs: 0, md: "260px" },
                    p: { xs: 3, md: 5 },
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
                        <Box>
                            <Typography variant="h4" color="white" sx={{ fontWeight: 800 }}>
                                {sidebarTab === "inventory" ? "Fleet Inventory" : "System Analytics"}
                            </Typography>
                            <Typography variant="body2" color="#B6BDC8">
                                Manage dealership vehicles and inventory counts.
                            </Typography>
                        </Box>
                        {sidebarTab === "inventory" && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Icons.Add />}
                                onClick={handleOpenAdd}
                                sx={{ backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#2563EB" }, py: 1.2 }}
                            >
                                Add Vehicle
                            </Button>
                        )}
                    </Box>

                    {/* METRIC SUMMARIES */}
                    <Grid container spacing={3} mb={5}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, backgroundColor: "#1E222B" }}>
                                <Typography variant="caption" color="#B6BDC8">TOTAL FLEET</Typography>
                                <Typography variant="h4" color="white" sx={{ fontWeight: 800, mt: 1 }}>{totalFleet}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, backgroundColor: "#1E222B" }}>
                                <Typography variant="caption" color="#B6BDC8">AVAILABLE CARS</Typography>
                                <Typography variant="h4" color="#22C55E" sx={{ fontWeight: 800, mt: 1 }}>{availableFleet}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, backgroundColor: "#1E222B" }}>
                                <Typography variant="caption" color="#B6BDC8">OUT OF STOCK</Typography>
                                <Typography variant="h4" color="#EF4444" sx={{ fontWeight: 800, mt: 1 }}>{outOfStockFleet}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, backgroundColor: "#1E222B" }}>
                                <Typography variant="caption" color="#B6BDC8">ASSET VALUE</Typography>
                                <Typography variant="h4" color="white" sx={{ fontWeight: 800, mt: 1 }}>
                                    ${totalAssets.toLocaleString()}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* VEHICLE MANAGEMENT TABLE */}
                    {sidebarTab === "inventory" && (
                        <TableContainer component={Paper} sx={{ backgroundColor: "#1E222B", borderRadius: "16px" }}>
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                                    <CircularProgress color="primary" />
                                </Box>
                            ) : vehicles.length === 0 ? (
                                <Box sx={{ textAlign: "center", py: 8 }}>
                                    <Typography variant="body1" color="#B6BDC8">No vehicles registered yet.</Typography>
                                </Box>
                            ) : (
                                <Table>
                                    <TableHead sx={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                                        <TableRow>
                                            <TableCell sx={{ color: "#B6BDC8", fontWeight: 700 }}>Thumbnail</TableCell>
                                            <TableCell sx={{ color: "#B6BDC8", fontWeight: 700 }}>Make</TableCell>
                                            <TableCell sx={{ color: "#B6BDC8", fontWeight: 700 }}>Model</TableCell>
                                            <TableCell sx={{ color: "#B6BDC8", fontWeight: 700 }}>Category</TableCell>
                                            <TableCell sx={{ color: "#B6BDC8", fontWeight: 700 }}>Price</TableCell>
                                            <TableCell sx={{ color: "#B6BDC8", fontWeight: 700 }}>Stock</TableCell>
                                            <TableCell align="right" sx={{ color: "#B6BDC8", fontWeight: 700 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vehicles.map((car) => {
                                            const isOutOfStock = car.quantity <= 0;
                                            return (
                                                <TableRow key={car.id} hover sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.01)" } }}>
                                                    <TableCell>
                                                        <Box
                                                            component="img"
                                                            src={getCarImage(car.category)}
                                                            alt={car.model}
                                                            sx={{ width: 60, height: 40, borderRadius: "6px", objectFit: "cover" }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ color: "white", fontWeight: 600 }}>{car.make}</TableCell>
                                                    <TableCell sx={{ color: "white" }}>{car.model}</TableCell>
                                                    <TableCell>
                                                        <Chip label={car.category} size="small" sx={{ borderRadius: "6px" }} />
                                                    </TableCell>
                                                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                                                        ${parseFloat(car.price).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isOutOfStock ? (
                                                            <Chip label="Out of Stock" color="error" size="small" sx={{ fontWeight: 700, borderRadius: "6px" }} />
                                                        ) : (
                                                            <Chip label={`${car.quantity} items`} color="success" size="small" sx={{ fontWeight: 700, borderRadius: "6px" }} />
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            size="small"
                                                            color="success"
                                                            onClick={() => handleOpenRestock(car)}
                                                            sx={{ mr: 1, backgroundColor: "rgba(34, 197, 94, 0.1)", color: "#22C55E", "&:hover": { backgroundColor: "#22C55E", color: "white" } }}
                                                        >
                                                            Restock
                                                        </Button>
                                                        <IconButton onClick={() => handleOpenEdit(car)} sx={{ color: "#B6BDC8", "&:hover": { color: "white" } }}>
                                                            <Icons.Edit />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleOpenDelete(car)} sx={{ color: "#EF4444", "&:hover": { color: "white" } }}>
                                                            <Icons.Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </TableContainer>
                    )}

                    {sidebarTab === "dashboard" && (
                        <Paper sx={{ p: 4, backgroundColor: "#1E222B", color: "white", borderRadius: "16px" }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                Inventory Distribution By Category
                            </Typography>
                            <Typography variant="body2" color="#B6BDC8" sx={{ mb: 4 }}>
                                Breakdowns of vehicles stored in our active dealership network databases.
                            </Typography>
                            <Grid container spacing={3}>
                                {["SUV", "Sedan", "Hatchback", "Truck", "Luxury"].map(cat => {
                                    const count = vehicles.filter(v => v.category === cat).length;
                                    return (
                                        <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={cat}>
                                            <Box sx={{ p: 2, borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
                                                <Typography variant="body2" color="#B6BDC8">{cat}</Typography>
                                                <Typography variant="h5" color="white" fontWeight={700} sx={{ mt: 1 }}>{count}</Typography>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Paper>
                    )}
                </Container>
            </Box>

            {/* ADD / EDIT DIALOG */}
            <Dialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#181B22",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        width: "100%",
                        maxWidth: 500,
                    }
                }}
            >
                <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
                    {editVehicle ? "Edit Fleet Vehicle" : "Add Fleet Vehicle"}
                </DialogTitle>
                <Box component="form" onSubmit={handleSave}>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                            label="Vehicle Make"
                            placeholder="e.g. Toyota"
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                        />
                        <TextField
                            label="Vehicle Model"
                            placeholder="e.g. Fortuner"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        />
                        <TextField
                            select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="SUV">SUV</MenuItem>
                            <MenuItem value="Sedan">Sedan</MenuItem>
                            <MenuItem value="Hatchback">Hatchback</MenuItem>
                            <MenuItem value="Truck">Truck</MenuItem>
                            <MenuItem value="Luxury">Luxury</MenuItem>
                        </TextField>
                        <TextField
                            label="Price ($)"
                            type="number"
                            placeholder="e.g. 4500000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <TextField
                            label="Initial Quantity"
                            type="number"
                            placeholder="e.g. 5"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={() => setFormOpen(false)} sx={{ color: "#B6BDC8" }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            sx={{ backgroundColor: "#3B82F6" }}
                        >
                            {saving ? <CircularProgress size={20} color="inherit" /> : "Save Fleet Item"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
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
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "2px solid #EF4444",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </Box>
                </Box>
                <DialogTitle sx={{ color: "white", fontWeight: 800, p: 0 }}>
                    Are you sure?
                </DialogTitle>
                <DialogContent sx={{ p: 0, mt: 1, mb: 3 }}>
                    <Typography variant="body2" color="#B6BDC8">
                        This action is permanent and will completely delete the selected vehicle from dealership inventory records.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", p: 0 }}>
                    <Button onClick={() => setDeleteOpen(false)} sx={{ color: "#B6BDC8", mr: 1 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleting}
                        sx={{ backgroundColor: "#EF4444", "&:hover": { backgroundColor: "#DC2626" } }}
                    >
                        {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete Vehicle"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* RESTOCK DIALOG */}
            <Dialog
                open={restockOpen}
                onClose={() => setRestockOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#181B22",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        width: "100%",
                        maxWidth: 400,
                    }
                }}
            >
                <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
                    Restock Fleet Vehicle
                </DialogTitle>
                <Box component="form" onSubmit={handleRestock}>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {vehicleToRestock && (
                            <Typography variant="body2" color="#B6BDC8">
                                Restocking <strong>{vehicleToRestock.make} {vehicleToRestock.model}</strong>. Current inventory is {vehicleToRestock.quantity} units.
                            </Typography>
                        )}
                        <TextField
                            label="Quantity to Add"
                            type="number"
                            placeholder="e.g. 10"
                            value={restockQty}
                            onChange={(e) => setRestockQty(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={() => setRestockOpen(false)} sx={{ color: "#B6BDC8" }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            disabled={restocking}
                            sx={{ backgroundColor: "#22C55E", "&:hover": { backgroundColor: "#16A34A" } }}
                        >
                            {restocking ? <CircularProgress size={20} color="inherit" /> : "Add Inventory"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}

export default Admin;

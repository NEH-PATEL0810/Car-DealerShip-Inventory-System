import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Admin from "../pages/Admin/Admin";
import Profile from "../pages/Profile/Profile";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Navbar />
            <div style={{ paddingTop: "70px" }}> {/* Offset for fixed transparent navbar */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        background: "#1E222B",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                    }
                }}
            />
        </BrowserRouter>
    );
}

export default AppRoutes;

import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Dashboard</h1>} />
                <Route path="/login" element={<h1>Login</h1>} />
                <Route path="/register" element={<h1>Register</h1>} />
                <Route path="/admin" element={<h1>Admin</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;

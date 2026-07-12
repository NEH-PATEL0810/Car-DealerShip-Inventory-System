import api from "../api/axios";

export const getVehicles = async () => {
    const response = await api.get("vehicles/");
    return response.data;
};

export const searchVehicles = async (params) => {
    const response = await api.get("vehicles/search/", { params });
    return response.data;
};

export const createVehicle = async (vehicleData) => {
    const response = await api.post("vehicles/", vehicleData);
    return response.data;
};

export const updateVehicle = async (pk, vehicleData) => {
    const response = await api.put(`vehicles/${pk}/`, vehicleData);
    return response.data;
};

export const deleteVehicle = async (pk) => {
    const response = await api.delete(`vehicles/${pk}/`);
    return response.data;
};

export const purchaseVehicle = async (pk) => {
    const response = await api.post(`vehicles/${pk}/purchase/`);
    return response.data;
};

export const restockVehicle = async (pk, quantity) => {
    const response = await api.post(`vehicles/${pk}/restock/`, { quantity });
    return response.data;
};

export const getUserPurchases = async () => {
    const response = await api.get("vehicles/purchases/");
    return response.data;
};

export const getAllPurchases = async () => {
    const response = await api.get("vehicles/purchases/all/");
    return response.data;
};

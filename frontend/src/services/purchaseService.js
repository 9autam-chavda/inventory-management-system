import api from "../api/api";

const purchaseService = {

    getAll: async () => {
        const response = await api.get("/purchases");
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/purchases/${id}`);
        return response.data;
    },

    create: async (purchase) => {
        const response = await api.post("/purchases", purchase);
        return response.data;
    },

    update: async (id, purchase) => {
        const response = await api.put(`/purchases/${id}`, purchase);
        return response.data;
    },

    remove: async (id) => {
        await api.delete(`/purchases/${id}`);
    }

};

export default purchaseService;
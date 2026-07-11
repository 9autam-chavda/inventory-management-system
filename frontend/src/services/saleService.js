import api from "../api/api";

const saleService = {
    getAll: async () => {
        const response = await api.get("/sales");
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/sales/${id}`);
        return response.data;
    },

    create: async (sale) => {
        const response = await api.post("/sales", sale);
        return response.data;
    },

    update: async (id, sale) => {
        const response = await api.put(`/sales/${id}`, sale);
        return response.data;
    },

    remove: async (id) => {
        await api.delete(`/sales/${id}`);
    }
};

export default saleService;
import api from "../api/api";

const invoiceService = {

    getAll: async () => {
        const response = await api.get("/invoices");
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/invoices/${id}`);
        return response.data;
    },

    generate: async (saleId) => {
        const response = await api.post(`/invoices/generate/${saleId}`);
        return response.data;
    },

    remove: async (id) => {
        await api.delete(`/invoices/${id}`);
    }

};

export default invoiceService;
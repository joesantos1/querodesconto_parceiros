import api from './api';

//services para stores
export const getCategories = async () => {
    try {
        const response = await api.get('/lojas/categorias');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
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

export const getStoreCategories = async (storeId: string) => {
    try {
        const response = await api.get(`/lojas/${storeId}/categorias`);
        return response.data;
    } catch (error) {
        console.error('Error fetching store categories:', error);
        throw error;
    }
};

export const setNewStoreCategory = async (categoryData: any) => {
    try {
        const response = await api.post('/lojas/categorias', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating new category:', error);
        throw error;
    }
};

export const setLojistaStore = async (storeId: string, storeData: any) => {
    try {
        const response = await api.post(`/lojistas/store/${storeId}/assign`, storeData);
        return response.data;
    } catch (error) {
        console.error('Error creating lojista store:', error);
        throw error;
    }
};

export const getLojistasByStoreId = async (storeId: string) => {
    try {
        const response = await api.get(`/lojistas/store/${storeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lojistas by store id:', error);
        throw error;
    }
};

export const removeLojistaFromStore = async (storeId: string, lojistaId: string) => {
    try {
        const response = await api.delete(`/lojistas/store/${storeId}/remove/${lojistaId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing lojista from store:', error);
        throw error;
    }
};

export const removeStoreCategory = async (categoryId: string) => {
    try {
        const response = await api.delete(`/lojas/categorias/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing category:', error);
        throw error;
    }
};

export const createNewStore = async (storeData: any) => {
    try {
        const response = await api.post('/lojas', storeData);
        return response.data;
    } catch (error) {
        console.error('Error creating new store:', error);
        throw error;
    }
};

export const getMyStores = async () => {
    try {
        const response = await api.get('/lojas/lojista');
        return response.data;
    } catch (error) {
        console.error('Error fetching my stores:', error);
        throw error;
    }
};

export const getStoreToEditById = async (storeId: string) => {
    try {
        const response = await api.get(`/lojas/edit/${storeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching store by id:', error);
        throw error;
    }
};
export const updateStore = async (storeId: string, updateData: any) => {
    try {
        const response = await api.put(`/lojas/${storeId}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating store:', error);
        throw error;
    }
};

export const deleteStore = async (storeId: string) => {
    try {
        const response = await api.delete(`/lojas/${storeId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting store:', error);
        throw error;
    }
};

export const updateLogoStore = async (storeId: string, logoData: any) => {
    try {
        const response = await api.put(`/lojas/logo/${storeId}`, logoData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating store logo:', error);
        throw error;
    }
};

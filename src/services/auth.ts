import api from './api';
//import { getCachedItem, setCachedItem, deleteCachedItem, clearAllCache } from './secureStorageCache';
import * as SecureStore from 'expo-secure-store';

export const login = async (email: string, telefone: string, pass: string) => {
    try {
        const response = await api.post('/auth/lojista', { email, telefone, pass });

        await SecureStore.setItemAsync('token', response.data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(response.data.userData));

        return response.data;
    } catch (error) {
        //console.error('Erro durante o login:', error);
        throw error;
    }
};

export const logout = async () => {
    
    try {
        // Limpa o token do SecureStore
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        
    } catch (error) {
        console.error('Erro durante o logout:', error);
    }
};

export const checkAuthenticated = async () => {
    try {
         const token = await SecureStore.getItemAsync('token');

        return !!token;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
    }
};

// Função auxiliar para obter dados do usuário
export const getUserData = async () => {
    try {
        const userData = await SecureStore.getItemAsync('user');
        // Obtém os dados do usuário do SecureStore
        const user = JSON.parse(userData || '{}');

        return { user };

    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        return null;
    }
};
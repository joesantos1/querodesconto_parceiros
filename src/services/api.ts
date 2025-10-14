import axios from 'axios';
//import { getCachedItem, setCachedItem, deleteCachedItem, clearAllCache } from './secureStorageCache';
import * as SecureStore from 'expo-secure-store';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/campanhas/active/all',
    '/lojas/categorias'
];

const api = axios.create({
    baseURL,
    timeout: 30000, // ✅ Adiciona timeout
});

// ✅ Interceptor otimizado
api.interceptors.request.use(
    async config => {
        // Verifica se a rota atual está na lista de rotas públicas
        const isPublicRoute = publicRoutes.some(route => {
            if (typeof route === 'string') {
                return config.url?.includes(route);
            }
            return false;
        });

        if (!isPublicRoute) {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    error => {
        console.error('Erro no interceptor de requisição:', error);
        return Promise.reject(error);
    }
);

// ✅ Interceptor de resposta otimizado
api.interceptors.response.use(
    response => response,
    async error => {
        console.error('INTERCEPT API - ERROR:', {
            message: error.response?.data?.message,
            code: error.code,
            status: error.response?.status,
            url: error.config?.url,
        });

        return Promise.reject(error);
    }
);

export default api;
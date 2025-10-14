import api from './api';
import { Cupom, CupomUsuario } from '@/types';

export const getCupomById = async (id: number) => {
  try {
    const response = await api.get(`/cupons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cupom by ID:', error);
    throw error;
  }
};

export const setCupomParaUsuario = async (cupomId: number) => {
  try {
    const response = await api.post(`/cupons/user/`, { cupomId });
    return response.data;
  } catch (error) {
    console.error('Error setting cupom for user:', error);
    throw error;
  } 
};

export const getCuponsUsuario = async (): Promise<CupomUsuario[]> => {
  try {
    const response = await api.get('/cupons/user/meuscupons');
    return response.data;
  } catch (error) {
    console.error('Error fetching cupons for user:', error);
    throw error;
  }
};

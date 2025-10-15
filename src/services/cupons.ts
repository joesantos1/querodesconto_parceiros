import api from './api';
import { Cupom, CupomUsuario } from '@/types';

export const getAllCupons = async (): Promise<Cupom[]> => {
  try {
    const response = await api.get('/cupons');
    return response.data;
  } catch (error) {
    console.error('Error fetching all cupons:', error);
    throw error;
  }
};

export const getMyCupons = async (): Promise<Cupom[]> => {
  try {
    const response = await api.get('/cupons/meus-cupons');
    return response.data;
  } catch (error) {
    console.error('Error fetching my cupons:', error);
    throw error;
  }
};

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

// CRUD para cupons
export const createCupom = async (cupomData: Partial<Cupom>) => {
  try {
    const response = await api.post('/cupons', cupomData);
    return response.data;
  } catch (error) {
    console.error('Error creating cupom:', error);
    throw error;
  }
};

export const updateCupom = async (id: number, cupomData: Partial<Cupom>) => {
  try {
    const response = await api.put(`/cupons/${id}`, cupomData);
    return response.data;
  } catch (error) {
    console.error('Error updating cupom:', error);
    throw error;
  }
};

export const deleteCupom = async (id: number) => {
  try {
    const response = await api.delete(`/cupons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting cupom:', error);
    throw error;
  }
};

export const getCuponsByStore = async (storeId: number): Promise<Cupom[]> => {
  try {
    const response = await api.get(`/cupons/loja/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cupons by store:', error);
    throw error;
  }
};

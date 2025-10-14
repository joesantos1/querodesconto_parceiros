import api from './api';

export const getAllAvisos = async () => {
  try {
    const response = await api.get(`/avisos/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    throw error;
  }
};

export const getAllAvisosLogado = async () => {
  try {
    const response = await api.get(`/avisos/logado`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    throw error;
  }
};

//Busca id do ultimo avis
export const getLastAvisoId = async () => {
  try {
    const response = await api.get(`/avisos/ultimo`);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar último aviso:', error);
    throw error;
  }
};
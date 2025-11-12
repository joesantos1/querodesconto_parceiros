import api from './api';

export const getAllCampanhas = async () => {
  try {
    const response = await api.get('/campanhas/lojista');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyCampanhas = async () => {
  try {
    const response = await api.get(`/campanhas/lojista`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCampanhaById = async (id: number) => {
  try {
    const response = await api.get(`/campanhas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCampanhaByLojaId = async (lojaId: number) => {
  try {
    const response = await api.get(`/campanhas/store/${lojaId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCampanha = async (campanhaData: any) => {
  try {
    const response = await api.post('/campanhas', campanhaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCampanha = async (id: number, campanhaData: any) => {
  try {
    const response = await api.put(`/campanhas/${id}`, campanhaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCampanha = async (id: number) => {
  try {
    const response = await api.delete(`/campanhas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

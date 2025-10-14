import api from './api';

export const getAllCampanhas = async () => {
  try {
    const response = await api.get(`/campanhas/active/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

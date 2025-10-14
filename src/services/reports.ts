import api from './api';

//services para reports

export const createReport = async (reportData: any): Promise<any> => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
}
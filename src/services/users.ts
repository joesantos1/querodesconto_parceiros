import api from './api';

export const createUser = async (userData: any) => {
  try {
    // Configuração especial para FormData
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
    return api.post('/lojistas', userData, config).then(r => r.data);
  } catch (error) {
    console.log('Erro ao criar usuário:', error);
    throw error;
  }

};
export const getUserById = async () => {
  try {
    const r = await api.get(`/usuarios`);  
    return r.data;
  } catch (error) {
    console.log('Erro ao buscar usuário:', error);
    throw error;
  }
  
};
export const getPerfilUser = async (id: number) => api.get(`/usuarios/perfil/${id}`).then(r => r.data);
export const getPerfilUserLogging = async (id: number) => api.get(`/usuarios/perfil_logado/${id}`).then(r => r.data);
export const updateUser = async (userData: any) => {
  try {
    // Para dados JSON, manter o Content-Type
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return api.put(`/lojistas`, userData, config).then(r => r.data);
  } catch (error) {
    throw error;
  }
};
export const updateFotoUser = async (userData: any) => {
  try {

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const r = await api.post('/usuarios/minhafoto', userData, config);
    return r.data;
  } catch (error) {
    console.error('Erro ao atualizar foto do usuário:', error);

    throw error;
  }
};
export const updateUserPushToken = async (expo_push_token: string) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return api.put(`/lojistas/push-token`, { expo_push_token }, config).then(r => r.data);
  } catch (error) {
    console.log('Erro ao atualizar token de push do usuário:', error);
    throw error;
  }
};

export const getIdUsuarioAfiliado = async (codigo: string) => {
  try {
    const r = await api.get(`/usuarios/afiliados/${codigo}`);  
    return r.data;
  } catch (error) {
    console.log('Erro ao buscar usuário:', error);
    throw error;
  }
  
};
export const getNewPassword = async (email: string) => {
  try {
    const r = await api.post(`/lojistas/novasenha`, { email });
    return r.data;
  } catch (error) {
    console.log('Erro ao solicitar nova senha:', error);
    throw error;
  }
};
export const editPassword = async (userData: any) => {
  try {
    return api.put(`/lojistas/senha`, userData).then(r => r.data);
  } catch (error) {
    console.log('Erro ao editar senha do usuário:', error);
    throw error;
  }
};
export const sendEmailContato = async (emailData: any) => {
  try {
    const response = await api.post('/lojistas/contato-suporte', emailData);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
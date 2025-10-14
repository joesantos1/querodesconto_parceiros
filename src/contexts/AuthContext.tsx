import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthenticated, getUserData, login, logout } from '@/services/auth';
import { Alert } from 'react-native';
import { updatePushToken } from '@/services/push';
import { useNotifications } from '@/hooks/useNotifications';
import api from '@/services/api';

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  signIn: (email: string, telefone: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  signIn: async () => { },
  signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useNotifications();

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    const responseInterceptor = intercept();
    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  const intercept = () => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.data?.code === 'SESSION_REVOKED') {
          await new Promise(resolve => {
            Alert.alert(
              'Sessão Encerrada',
              'Sua conta foi acessada em outro dispositivo. Você foi desconectado por segurança.',
              [{ text: 'OK', onPress: () => resolve(null) }]
            );
          });
          await signOut();
          return Promise.reject(error);
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          await new Promise(resolve => {
            Alert.alert(
              'Erro de Autenticação',
              'Sua sessão expirou ou você não tem permissão para acessar este recurso.',
              [{ text: 'OK', onPress: () => resolve(null) }]
            );
          });
          await signOut();
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
    return responseInterceptor;
  }

  async function checkAuthState() {
    try {
      const authenticated = await checkAuthenticated();

      if (authenticated) {
        const userData = await getUserData();
        setUser(userData);
        return true;
      }

      setUser(null);
      return false;

    } catch (error) {
      setUser(null);
      //console.error('[AuthContext] Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, telefone: string, senha: string) => {
    try {
     // setLoading(true);

      const response = await login(email, telefone, senha);
      setUser(response.userData);
      
      await checkAuthState();
      await updatePushToken();

    } catch (error) {
      throw error;
    } finally {
     // setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      //setLoading(true);
      await logout();
      setUser(null);

    } catch (error) {
      //console.error('[AuthContext] Erro no logout:', error);
      Alert.alert('Erro', 'Falha ao fazer logout');
    } finally {
      //setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    console.error('[useAuth] Contexto não encontrado - verifique se o componente está dentro de AuthProvider');
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
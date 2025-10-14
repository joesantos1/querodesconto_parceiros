// Exemplo em App.js ou onde preferir
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { updateUserPushToken } from './users';

// Configuração global das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

    // Configuração específica para iOS
  if (Platform.OS === 'ios') {
    // Solicitar permissões específicas do iOS
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: true,
          allowProvisional: false,
          //allowAnnouncements: false,
        },
      });
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.error('Falha ao obter permissão para notificações no iOS!');
      return;
    }
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.error('Falha ao obter permissão para notificações!');
      return;
    }

    try {
      // APENAS EXPO PUSH TOKEN - SEM FIREBASE
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: "85cf01c5-4905-4553-b907-dd6a94a97dd3"
      })).data;
      //console.log('Expo Push Token:', token);
    } catch (error) {
      console.error('Erro ao obter token Expo:', error);
      throw error;
    }
  } else {
    console.log('Precisa usar em um dispositivo físico para notificações push');
  }

  return token;
}

export const updatePushToken = async () => {
  try {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      //console.log('Token de push obtido:', token);
      const response = await updateUserPushToken(token);
      //console.log('Token de push atualizado com sucesso:', response);
    }
  } catch (error) {
    console.error('Erro ao atualizar token de push:', error);
    throw error;
  }
};
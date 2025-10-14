import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// Configuração global (apenas uma vez)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

export const useNotifications = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      // Verificar notificação inicial
      const response = await Notifications.getLastNotificationResponse();
      if (response?.notification.request.content.data?.url) {
        /*
        setTimeout(() => {
          router.replace(response.notification.request.content.data.url as any);
        }, 2000);
        */
      }
    };

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      //console.log('Notificação recebida:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
    });

    setupNotifications();

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);
};
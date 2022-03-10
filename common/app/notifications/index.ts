import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { t } from '../../../strings';
import { colors } from '../../styles';

export const init = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      console.log('handling...');
      // notification.request.content.data
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });
  if (Platform.OS === 'android') {
    // const notificationChannels = await Notifications.getNotificationChannelsAsync();
    // console.log(notificationChannels);
    await Notifications.setNotificationChannelAsync('order-request', {
      name: t('Novas corridas'),
      importance: Notifications.AndroidImportance.MAX,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
      sound: 'order_request.wav',
    });
    await Notifications.setNotificationChannelAsync('order-update', {
      name: t('Atualizações do pedido'),
      importance: Notifications.AndroidImportance.MAX,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
    });
    await Notifications.setNotificationChannelAsync('order-chat', {
      name: t('Chat durante entrega'),
      importance: Notifications.AndroidImportance.MAX,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
    });
    await Notifications.setNotificationChannelAsync('profile-update', {
      name: t('Atualizações de perfil'),
      importance: Notifications.AndroidImportance.HIGH,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
    });
    await Notifications.setNotificationChannelAsync('general', {
      name: t('Notificações gerais'),
      importance: Notifications.AndroidImportance.DEFAULT,
      enableVibrate: false,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
      lightColor: colors.green100,
    });
  }
};

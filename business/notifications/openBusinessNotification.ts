import { Business, WithId } from '@appjusto/types';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { colors } from '../../common/styles';
import { t } from '../../strings';

// reference: https://dev.to/neeleshrj/local-notifications-using-expo-25il

// initializing the notification handler and registering the push notification function
export const initOBN = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      console.log('handling OBN...');
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('open-business', {
      name: t('Abrir restaurante'),
      importance: Notifications.AndroidImportance.MAX,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
    });
  }
};
// scheduling notification function
export const scheduleOBNotification = async (business: WithId<Business>, today: Date) => {
  if (!business || !today) return;
  const day = today.getDay();
  const dayIndex = day === 0 ? 6 : day - 1;
  const daySchedule = business.schedules[dayIndex].schedule;
  const startH = parseInt(daySchedule[dayIndex].from.slice(0, 2));
  const startM = parseInt(daySchedule[dayIndex].from.slice(2, 4));
  const openHour = dayjs().hour(startH);
  const openMinute = openHour.minute(startM);
  const notification = await Notifications.scheduleNotificationAsync({
    content: {
      title: t('Hora de abrir!'),
      body: t('Acesse o app ou o gerenciador de pedidos no desktop'),
      // sound: ,
      // data: ,
    },
    trigger: {
      day,
      hour: openHour.toDate().getHours(),
      minute: openMinute.toDate().getMinutes(),
      repeats: true,
    },
  });
  return notification;
};

import { Business, WithId } from '@appjusto/types';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { getOpeningDates, scheduleFromDate } from '../../common/store/api/business/selectors';
import { t } from '../../strings';

export const useConfigureBusinessNotifications = (business: WithId<Business> | undefined) => {
  React.useEffect(() => {
    if (!business?.id) return;
    if (!business.schedules) return;
    console.log('useConfigureBusinessNotifications');
    (async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      const now = new Date();
      getOpeningDates(scheduleFromDate(business.schedules, now), now).forEach((date) => {
        if (date.getTime() > now.getTime()) {
          console.log('Agendando notificação para', date);
          Notifications.scheduleNotificationAsync({
            content: {
              title: t('Hora de abrir o restaurante'),
              body: t('Abra o App e fique disponível para receber pedidos.'),
              data: {},
            },
            trigger: {
              date,
              channelId: 'profile-update',
            },
          }).then(null);
        }
      });
    })();
  }, [business?.id]);
};

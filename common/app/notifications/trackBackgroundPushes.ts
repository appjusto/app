import { PushMessageData } from '@appjusto/types';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Sentry from 'sentry-expo';
import { track } from '../../store/api/track';
import { getBusiness } from '../../store/business/selectors';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';
import { AppStore } from '../context';

const TASK_BACKGROUND_PUSHES = 'TASK_BACKGROUND_PUSHES';

export const startTrackBGPushesTask = async () => {
  console.log('starting BGPushes Task');
  await BackgroundFetch.registerTaskAsync(TASK_BACKGROUND_PUSHES);
};

export const stopTrackBGPushesTask = async () => {
  console.log('stopping BGPushes task');
  try {
    await BackgroundFetch.unregisterTaskAsync(TASK_BACKGROUND_PUSHES);
  } catch (error) {}
};

export const trackBGPushesExecutor = (store: AppStore, data: PushMessageData) => async () => {
  try {
    const state = store.getState();
    const flavor = getFlavor(state);
    if (data.action === 'order-update') {
      track(`${flavor} received in order-update push`, {
        action: data.action,
        orderId: data.orderId,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else if (data.action === 'order-chat') {
      track(`${flavor} received in order-chat push`, {
        action: data.action,
        orderId: data.orderId,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else if (data.action === 'navigate-business') {
      let user;
      if (flavor === 'consumer') user = getConsumer(state);
      if (flavor === 'courier') user = getCourier(state);
      if (flavor === 'business') user = getBusiness(state);
      track(`${flavor} received in navigate-business push`, {
        action: data.action,
        businessId: data.businessId,
        userId: user?.id ?? undefined,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    Sentry.Native.captureException(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
};

export const defineTrackBGPushesTask = (store: AppStore, data: PushMessageData) => {
  console.log('bgpushes task');
  TaskManager.defineTask(TASK_BACKGROUND_PUSHES, trackBGPushesExecutor(store, data));
};

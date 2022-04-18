import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Sentry from 'sentry-expo';
import { AppStore } from '../../common/app/context';
import Api from '../../common/store/api/api';
import { getBusiness } from '../../common/store/business/selectors';
import { getExtra } from '../../common/utils/config';

export const KEEP_ALIVE_INTERVAL = getExtra().environment === 'live' ? 60 * 10 : 10;

const TASK_KEEP_ALIVE = 'TASK_KEEP_ALIVE';

export const startKeepAliveTask = async () => {
  console.log('startKeepAliveTask');
  // console.log(await BackgroundFetch.getStatusAsync());
  await BackgroundFetch.registerTaskAsync(TASK_KEEP_ALIVE, {
    minimumInterval: KEEP_ALIVE_INTERVAL,
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
};

export const stopKeepAliveTask = async () => {
  console.log('stopKeepAliveTask');
  await BackgroundFetch.unregisterTaskAsync(TASK_KEEP_ALIVE);
};

const keepAliveExecutor = (store: AppStore, api: Api) => async () => {
  console.log('keepAliveExecutor');
  try {
    const state = store.getState();
    const business = getBusiness(state);
    console.log('business.status: ', business?.status);
    if (business?.status === 'open') {
      await api.business().sendKeepAlive(business.id);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    Sentry.Native.captureException(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
};

export const definekeepAliveTask = (store: AppStore, api: Api) => {
  console.log('definekeepAliveTask');
  TaskManager.defineTask(TASK_KEEP_ALIVE, keepAliveExecutor(store, api));
};

import { Business, WithId } from '@appjusto/types';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Sentry from 'sentry-expo';
import Api from '../../common/store/api/api';

const TASK_KEEP_ALIVE = 'TASK_KEEP_ALIVE';

export const registerKeepAliveTask = async () => {
  return BackgroundFetch.registerTaskAsync(TASK_KEEP_ALIVE, {
    minimumInterval: process.env.REACT_APP_ENVIRONMENT === 'live' ? 180 : 300,
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
};

const keepAliveExecutor =
  (api: Api, business?: WithId<Business>): TaskManager.TaskManagerTaskExecutor =>
  (body: TaskManager.TaskManagerTaskBody) => {
    if (!business) return;
    if (body.error) {
      Sentry.Native.captureException(body.error);
      return;
    }
    try {
      api.business().sendKeepAlive(business.id);
    } catch (error) {
      Sentry.Native.captureException(error);
    }
  };

export const keepAliveTask = (api: Api, business?: WithId<Business>) => {
  TaskManager.defineTask(TASK_KEEP_ALIVE, keepAliveExecutor(api, business));
};

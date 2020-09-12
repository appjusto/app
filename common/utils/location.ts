import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { t } from '../../strings';
import { AppStore } from '../app/context';
import Api from '../store/api/api';
import { isCourierFlavor } from '../store/config/selectors';
import { updateCourierLocation } from '../store/courier/actions';
import { getCourier, isCourierWorking } from '../store/courier/selectors';
import { LocationUpdateResult } from '../store/types';

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

export const startLocationUpdatesTask = () => {
  return Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1, // 1 meter minimum change betweens updates
    deferredUpdatesInterval: 1000, // 1 second minimum interval between updates
    foregroundService: {
      notificationTitle: t('Localização ativa'),
      notificationBody: t('Para desativar, entre no app e pare de trabalhar.'),
      notificationColor: '#78E08F',
    },
  });
};

export const stopLocationUpdatesTask = async () => {
  // const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION);
  // hasStartedLocationUpdatesAsync is returning true even when the task wasn't started yet
  // probably no harm to just ignore the error when stop un non started task
  Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION).catch(() => null);
};

const locationTaskExecutor = (store: AppStore, api: Api): TaskManager.TaskManagerTaskExecutor => (
  body: TaskManager.TaskManagerTaskBody
) => {
  if (body.error) {
    // TODO: log `error.message`
    return;
  }
  const result = body.data as LocationUpdateResult;
  console.log(result);
  const [location] = result.locations;

  const state = store.getState();
  const courier = getCourier(state);
  const shouldBroadcastLocation = isCourierFlavor(state) && isCourierWorking(state);
  if (courier && shouldBroadcastLocation) {
    store.dispatch(updateCourierLocation(api)(courier, location));
  }
};

export const defineLocationUpdatesTask = (store: AppStore, api: Api) => {
  TaskManager.defineTask(TASK_FETCH_LOCATION, locationTaskExecutor(store, api));
};

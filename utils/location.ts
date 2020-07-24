import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { updateCourierLocation } from '../store/actions/courier';
import { isCourierFlavor } from '../store/selectors/config';
import { isCourierWorking, getCourier } from '../store/selectors/courier';

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

export const startLocationUpdatesTask = () => {
  return Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 5, // 5 meter minimum change betweens updates
    deferredUpdatesInterval: 5000, // 5 seconds minimum interval between updates
  });
};

export const stopLocationUpdatesTask = () => {
  Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
};

export const defineLocationUpdatesTask = (store, api) => {
  TaskManager.defineTask(TASK_FETCH_LOCATION, ({ data: { locations }, error }) => {
    if (error) {
      // TODO: log `error.message`
      return;
    }
    const [location] = locations;

    const state = store.getState();
    const shouldBroadcastLocation = isCourierFlavor(state) && isCourierWorking(state);
    if (shouldBroadcastLocation) {
      store.dispatch(updateCourierLocation(api)(getCourier(state), location));
    }
  });
};

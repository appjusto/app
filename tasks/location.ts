import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import { Courier } from '../store/types';
import { updateCourierLocation } from '../store/actions/courier';
import { setLocation } from '../store/actions/location';
import { isCourierFlavor } from '../store/selectors/config';
import { isCourierWorking, getCourierProfile } from '../store/selectors/courier';

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
}

export const defineLocationUpdatesTask = (store, api) => {
  TaskManager.defineTask(TASK_FETCH_LOCATION, ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }
    const [location] = locations;
  
    const state = store.getState();
    store.dispatch(setLocation(location));
  
    const isCourier = isCourierFlavor(state);
    if (isCourier) {
      const courier = getCourierProfile(state) as Courier;
      const shouldBroadcastLocation = !!courier && isCourierWorking(state);
      if (shouldBroadcastLocation)
        store.dispatch(updateCourierLocation(api)(courier.id, location));
    }
  });
}


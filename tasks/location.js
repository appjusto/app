import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

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

export const defineLocationUpdatesTask = (handler) => TaskManager.defineTask(TASK_FETCH_LOCATION, handler);

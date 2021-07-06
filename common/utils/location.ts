import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import firebase from 'firebase';
import { LatLng } from 'react-native-maps';
import * as Sentry from 'sentry-expo';
import { t } from '../../strings';
import { AppStore } from '../app/context';
import Api from '../store/api/api';
import { getConsumer } from '../store/consumer/selectors';
import { getCourier } from '../store/courier/selectors';

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

export const startLocationUpdatesTask = () => {
  return Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 5, // receive updates only when the location has changed by at least this distance in meters.
    deferredUpdatesInterval: 5000, // minimum time to wait between each update in milliseconds.
    foregroundService: {
      notificationTitle: t('Localização ativa'),
      notificationBody: t('Para desativar acesse o app e fique indisponível para corridas.'),
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

interface LocationUpdateResult {
  locations: { coords: LatLng }[];
}

const locationTaskExecutor =
  (store: AppStore, api: Api): TaskManager.TaskManagerTaskExecutor =>
  (body: TaskManager.TaskManagerTaskBody) => {
    if (body.error) {
      Sentry.Native.captureException(body.error);
      return;
    }
    const result = body.data as LocationUpdateResult;
    const [location] = result.locations;
    const { latitude, longitude } = location.coords;
    const coordinates = new firebase.firestore.GeoPoint(latitude, longitude);

    const state = store.getState();
    const profile = getCourier(state) ?? getConsumer(state);
    if (profile?.id) api.profile().updateLocation(profile.id, coordinates);
  };

export const defineLocationUpdatesTask = (store: AppStore, api: Api) => {
  TaskManager.defineTask(TASK_FETCH_LOCATION, locationTaskExecutor(store, api));
};

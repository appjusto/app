import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GeoPoint } from 'firebase/firestore';
import { LatLng } from 'react-native-maps';
import * as Sentry from 'sentry-expo';
import { t } from '../../strings';
import { AppStore } from '../app/context';
import Api from '../store/api/api';
import { getConsumer } from '../store/consumer/selectors';
import { getCourier } from '../store/courier/selectors';

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

export const startLocationUpdatesTask = async () => {
  try {
    await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000, // Minimum time to wait between each update in milliseconds. Default value depends on accuracy option. (Android only)
      distanceInterval: 10, // Receive updates only when the location has changed by at least this distance in meters. Default value may depend on accuracy option.
      // deferredUpdatesInterval: 5000, // Minimum time interval in milliseconds that must pass since last reported location before all later locations are reported in a batched update. Defaults to 0.
      // deferredUpdatesDistance: 5, // The distance in meters that must occur between last reported location and the current location before deferred locations are reported. Defaults to 0.
      foregroundService: {
        notificationTitle: t('Localização ativa para entregas'),
        notificationBody: t('Para desativar acesse o app e fique indisponível para corridas.'),
        // notificationColor: '#78E08F',
      },
    });
  } catch (error: any) {
    Sentry.Native.captureException(error);
  }
};

export const stopLocationUpdatesTask = async () => {
  // const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION);
  // hasStartedLocationUpdatesAsync is returning true even when the task wasn't started yet
  // probably no harm to just ignore the error when stop un non started task
  try {
    await Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
  } catch (error) {
    // Sentry.Native.captureException(error);
  }
};

interface LocationUpdateResult {
  locations: { coords: LatLng; timestamp: number }[];
}

const locationTaskExecutor =
  (store: AppStore, api: Api): TaskManager.TaskManagerTaskExecutor =>
  (body: TaskManager.TaskManagerTaskBody) => {
    if (body.error) {
      Sentry.Native.captureException(body.error);
      return;
    }
    try {
      const state = store.getState();
      const profile = getCourier(state) ?? getConsumer(state);
      const result = body.data as LocationUpdateResult;
      // track('Location updates', {
      //   id: profile?.id,
      //   locations: result.locations,
      //   length: result.locations.length,
      // });
      const location = result.locations
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp)
        .find(() => true)!;
      const { latitude, longitude } = location.coords;
      const coordinates = new GeoPoint(latitude, longitude);

      if (profile?.id)
        api
          .profile()
          .updateLocation(profile.id, coordinates)
          .then(() => null);
    } catch (error: any) {
      Sentry.Native.captureException(error);
    }
  };

export const defineLocationUpdatesTask = (store: AppStore, api: Api) => {
  try {
    TaskManager.defineTask(TASK_FETCH_LOCATION, locationTaskExecutor(store, api));
  } catch (error: any) {
    Sentry.Native.captureException(error);
  }
};

import * as Permissions from 'expo-permissions';
import { useState, useEffect } from 'react';

import { startLocationUpdatesTask, stopLocationUpdatesTask } from '../utils/location';

export default function (shouldAskPermission: boolean) {
  // state
  const [locationPermission, setLocationPermission] = useState<string | null>(null);

  // side effects
  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    setLocationPermission(status);
  };

  // ask for permission
  useEffect(() => {
    if (shouldAskPermission) askPermission();
  }, [shouldAskPermission]);

  // start tasks
  useEffect(() => {
    if (locationPermission === 'granted') {
      startLocationUpdatesTask();

      return () => {
        stopLocationUpdatesTask();
      };
    }
  }, [locationPermission]);

  return locationPermission;
}

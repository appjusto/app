import { useState, useEffect } from 'react';
import * as Permissions from 'expo-permissions';
import { startLocationUpdatesTask, stopLocationUpdatesTask } from '../utils/location';
import { useDispatch } from 'react-redux';

export default function (shouldAskPermission) {
  // context
  const dispatch = useDispatch();

  // state
  const [locationPermission, setLocationPermission] = useState(null);

  // side effects
  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    setLocationPermission(status);
  }

  // ask for permission
  useEffect(() => {
    if (shouldAskPermission) askPermission();
  }, [shouldAskPermission]);

  // start tasks
  useEffect(() => {
    if (locationPermission === 'granted') {
      startLocationUpdatesTask();

      return async () => {
        await stopLocationUpdatesTask();
      }
    }
  }, [locationPermission]);

  return locationPermission;
}
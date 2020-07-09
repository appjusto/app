import { useState, useEffect } from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { startLocationUpdatesTask, stopLocationUpdatesTask } from '../tasks/location';
import { useDispatch } from 'react-redux';
import { setLocation } from '../store/actions/location';

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

  const startLocationUpdates = async () => {
    const location = await Location.getCurrentPositionAsync({});
    dispatch(setLocation(location));
    
    startLocationUpdatesTask();
  }

  // ask for permission
  useEffect(() => {
    if (shouldAskPermission) askPermission();
  }, [shouldAskPermission]);

  // start tasks
  useEffect(() => {
    if (locationPermission === 'granted') {
      startLocationUpdates();

      return async () => {
        await stopLocationUpdatesTask();
      }
    }
  }, [locationPermission]);

  return locationPermission;
}
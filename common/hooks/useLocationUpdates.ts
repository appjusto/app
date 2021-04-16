import * as Permissions from 'expo-permissions';
import React from 'react';
import { startLocationUpdatesTask, stopLocationUpdatesTask } from '../utils/location';

export default function (enabled: boolean, key: string): Permissions.PermissionStatus | undefined {
  // refs
  const currentKey = React.useRef(key);
  // state
  const [response, setResponse] = React.useState<Permissions.PermissionResponse | undefined>(
    undefined
  );
  // helpers
  const getCurrentResponse = async () => {
    setResponse(await Permissions.getAsync(Permissions.LOCATION));
  };
  const shouldAskPermission = (): boolean => {
    if (response === undefined) return false; // during initialization
    if (response.granted) return false;
    if (!enabled) return false;
    return response.canAskAgain;
  };
  // side effects
  // once
  // retrieve current permission status
  React.useEffect(() => {
    getCurrentResponse();
  }, []);
  // key is used to allow restarting the process of verification
  React.useEffect(() => {
    if (key !== currentKey.current) {
      console.log('useLocationUpdates: restarting check for location permission...');
      currentKey.current = key;
      // restart check process
      getCurrentResponse();
    }
  }, [key]);
  // check if we should ask permission or start/stop location updates task
  React.useEffect(() => {
    if (!enabled) {
      stopLocationUpdatesTask();
      return;
    }
    if (shouldAskPermission()) {
      (async () => {
        setResponse(await Permissions.askAsync(Permissions.LOCATION));
      })();
      return;
    }
    if (response) {
      if (response.granted) {
        startLocationUpdatesTask();
        // we probably shouldn't ever stop automatically; just when user disables location manually
        // return () => {
        //   stopLocationUpdatesTask();
        // };
      }
    }
  }, [enabled, response]);

  return response?.status;
}

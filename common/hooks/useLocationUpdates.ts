import * as Permissions from 'expo-permissions';
import React from 'react';
import { startLocationUpdatesTask, stopLocationUpdatesTask } from '../utils/location';

const shouldAskPermission = (
  response: Permissions.PermissionResponse | null | undefined
): boolean => {
  if (response === undefined) return false; // during initialization
  if (response === null) return true;
  if (response.granted) return false;
  return response.canAskAgain;
};

export default function (enabled: boolean, key: string): Permissions.PermissionStatus {
  const currentKey = React.useRef(key);
  // state
  const [permissionResponse, setPermissionResponse] = React.useState<
    Permissions.PermissionResponse | null | undefined
  >(undefined);

  // side effects
  // get current permission status
  React.useEffect(() => {
    (async () => {
      setPermissionResponse(await Permissions.getAsync(Permissions.LOCATION));
    })();
  }, []);
  // key is used to allow restarting the process of verification
  React.useEffect(() => {
    if (key !== currentKey.current) {
      currentKey.current = key;
      setPermissionResponse(null); // start or reset permission check process
    }
  }, [key]);
  // check if we should ask permission or start/stop location updates task
  React.useEffect(() => {
    if (enabled) {
      if (shouldAskPermission(permissionResponse)) {
        (async () => {
          setPermissionResponse(await Permissions.askAsync(Permissions.LOCATION));
        })();
        return;
      }
      if (permissionResponse) {
        if (permissionResponse.granted) {
          startLocationUpdatesTask();
          // we probably shouldn't ever stop automatically; just when user disables location manually
          // return () => {
          //   stopLocationUpdatesTask();
          // };
        }
      }
    } else {
      stopLocationUpdatesTask();
    }
  }, [enabled, permissionResponse]);

  return permissionResponse?.status ?? Permissions.PermissionStatus.UNDETERMINED;
}

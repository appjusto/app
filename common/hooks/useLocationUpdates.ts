import * as Permissions from 'expo-permissions';
import { useState, useEffect } from 'react';

import { stopLocationUpdatesTask, startLocationUpdatesTask } from '../utils/location';

const shouldAskPermission = (
  response: Permissions.PermissionResponse | null | undefined
): boolean => {
  if (response === undefined) return false; // during initialization
  if (response === null) return true;
  if (response.granted) return false;
  return response.canAskAgain;
};

export default function (enabled: boolean, key: string): Permissions.PermissionStatus {
  // state
  const [permissionResponse, setPermissionResponse] = useState<
    Permissions.PermissionResponse | null | undefined
  >(undefined);

  // side effects
  // key is used to allow restarting the process of verification
  useEffect(() => {
    setPermissionResponse(null); // start or reset permission check process
  }, [key]);

  // check if we should ask permission or start/stop location updates task
  useEffect(() => {
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

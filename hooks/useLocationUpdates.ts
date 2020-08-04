import * as Permissions from 'expo-permissions';
import { useState, useEffect } from 'react';

import { startLocationUpdatesTask, stopLocationUpdatesTask } from '../utils/location';

const shouldAskPermission = (response: Permissions.PermissionResponse | null): boolean => {
  if (response === null) return true;
  if (response.granted) return false;
  return response.canAskAgain;
};

export default function (enabled: boolean): Permissions.PermissionStatus {
  // state
  const [
    permissionResponse,
    setPermissionResponse,
  ] = useState<Permissions.PermissionResponse | null>(null);

  // side effects
  // ask permission
  const askPermission = async () => {
    setPermissionResponse(await Permissions.askAsync(Permissions.LOCATION));
  };

  // start tasks
  useEffect(() => {
    if (enabled) {
      if (shouldAskPermission(permissionResponse)) {
        askPermission();
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

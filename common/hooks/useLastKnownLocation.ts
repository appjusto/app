import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { useState, useEffect } from 'react';

const shouldAskPermission = (
  response: Permissions.PermissionResponse | null | undefined
): boolean => {
  if (response === undefined) return false; // during initialization
  if (response === null) return true;
  if (response.granted) return false;
  return response.canAskAgain;
};

export default function (enabled: boolean, key: string) {
  // state
  const [permissionResponse, setPermissionResponse] = useState<
    Permissions.PermissionResponse | null | undefined
  >(undefined);
  const [lastKnownLocation, setLastKnownLocation] = useState<Location.LocationObject | null>(null);

  // side effects
  // key is used to allow restarting the verification process
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
      if (permissionResponse?.granted) {
        (async () => {
          setLastKnownLocation(await Location.getLastKnownPositionAsync());
        })();
      }
    }
  }, [enabled, permissionResponse]);

  return { lastKnownLocation, permissionResponse };
}

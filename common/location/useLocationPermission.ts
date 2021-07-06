import * as Location from 'expo-location';
import {
  getBackgroundPermissionsAsync,
  getForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import React from 'react';

type Mode = 'background' | 'foreground';

const getPermission = (mode: Mode) =>
  mode === 'background' ? getBackgroundPermissionsAsync() : getForegroundPermissionsAsync();

const requestPermission = (mode: Mode) =>
  mode === 'background' ? requestBackgroundPermissionsAsync() : requestForegroundPermissionsAsync();

export const useLocationPermission = (mode: Mode, shouldRequest?: boolean) => {
  // state
  const [status, setStatus] = React.useState<Location.PermissionStatus>();
  // helpers
  const request = React.useCallback(() => {
    requestPermission(mode).then(({ status }) => setStatus(status));
  }, [mode]);
  const get = React.useCallback(() => {
    getPermission(mode).then(({ status }) => setStatus(status));
  }, [mode]);
  // side effects
  // get initial status
  React.useEffect(() => {
    get();
  }, [mode, get]);
  React.useEffect(() => {
    // skip if not initialized yet
    if (status === undefined) return;
    // skip if granted
    if (status === 'granted') return;
    // skip if not requesting automatically
    if (!shouldRequest) return;
    // request
    request();
  }, [status, shouldRequest, request]);

  return { status, get, request };
};

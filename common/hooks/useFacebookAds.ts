import * as Device from 'expo-device';
import { PermissionStatus } from 'expo-location';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import React from 'react';
import { Settings } from 'react-native-fbsdk-next';

export const useFacebookAds = () => {
  // state
  const [status, setStatus] = React.useState<PermissionStatus>(PermissionStatus.UNDETERMINED);
  // helpers
  const askPermission = async () => {
    try {
      const { status: existingStatus } = await getTrackingPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await requestTrackingPermissionsAsync();
        finalStatus = status;
      }
      setStatus(finalStatus);
    } catch (error) {
      setStatus(PermissionStatus.DENIED);
    }
  };
  // side effects
  // required for iOS > 14
  React.useEffect(() => {
    if (status === 'granted') {
      Settings.setAdvertiserTrackingEnabled(true);
    }
  }, [status]);
  // initial
  React.useEffect(() => {
    if (Device.isDevice) {
      Settings.initializeSDK();
      askPermission()
        .then(() => null)
        .catch(console.error);
    }
  }, []);
  // result
  return status;
};

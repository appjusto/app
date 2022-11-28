import * as FacebookAds from 'expo-ads-facebook';
import * as Device from 'expo-device';
import { PermissionStatus } from 'expo-location';
import React from 'react';

export const useFacebookAds = () => {
  // state
  const [status, setStatus] = React.useState<PermissionStatus>(PermissionStatus.UNDETERMINED);
  // helpers
  const askPermission = async () => {
    try {
      const { status: existingStatus } = await FacebookAds.AdSettings.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await FacebookAds.AdSettings.requestPermissionsAsync();
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
      FacebookAds.AdSettings.setAdvertiserTrackingEnabled(true);
    }
  }, [status]);
  // initial
  React.useEffect(() => {
    if (Device.isDevice) {
      askPermission()
        .then(() => null)
        .catch(console.error);
    }
  }, []);
  // result
  return status;
};

import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
export default function ({ children, ...props }) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      {...props}
    >
      {children}
    </MapView>
  );
}

import React, { useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, MapViewProps, LatLng } from 'react-native-maps';

interface Props extends MapViewProps {
  children?: React.ReactNode | React.ReactNode[];
  coordinates?: LatLng[];
  fitToElements?: boolean;
}

export default React.forwardRef(
  ({ children, coordinates, fitToElements, ...props }: Props, externalRef) => {
    const internalRef = useRef<MapView>(null);
    const ref = (externalRef as React.RefObject<MapView>) || internalRef;

    // effects
    const onMapReadyHandler = useCallback(() => {
      if (fitToElements && coordinates) {
        if (Platform.OS === 'ios') {
          ref?.current?.fitToElements(false);
        } else {
          ref?.current?.fitToCoordinates(coordinates, {
            animated: true,
            edgePadding: {
              top: 150,
              right: 50,
              bottom: 50,
              left: 50,
            },
          });
        }
      }
    }, [ref, fitToElements]);

    // UI
    return (
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        onMapReady={onMapReadyHandler}
        // onLayout={onMapReadyHandler}
        {...props}
      >
        {children}
      </MapView>
    );
  }
);

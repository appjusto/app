import React from 'react';
import { Platform } from 'react-native';
import MapView, { LatLng, MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps';

interface Props extends MapViewProps {
  children?: React.ReactNode | React.ReactNode[];
  coordinates?: LatLng[];
  fitToElements?: boolean;
}

export default React.forwardRef(
  ({ children, coordinates, fitToElements, ...props }: Props, externalRef) => {
    const internalRef = React.useRef<MapView>(null);
    const ref = (externalRef as React.RefObject<MapView>) || internalRef;

    // effects
    const onMapReadyHandler = React.useCallback(() => {
      console.log('onMapReadyHandler', Platform.OS);
      if (fitToElements && coordinates) {
        if (Platform.OS === 'ios') {
          // ref?.current?.fitToElements(false);
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
    }, [fitToElements, coordinates, ref]);

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

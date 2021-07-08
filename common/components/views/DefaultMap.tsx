import React from 'react';
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
    // const onMapReadyHandler = React.useCallback(() => {
    //   if (fitToElements && coordinates) {
    //     if (Platform.OS === 'ios') {
    //       ref?.current?.fitToElements(false);
    //     } else {
    //       ref?.current?.fitToCoordinates(coordinates, {
    //         animated: true,
    //         edgePadding: {
    //           top: 150,
    //           right: 50,
    //           bottom: 50,
    //           left: 50,
    //         },
    //       });
    //     }
    //   }
    // }, [ref, fitToElements]);

    // UI
    return (
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        // onMapReady={onMapReadyHandler}
        // onLayout={onMapReadyHandler}
        {...props}
      >
        {children}
      </MapView>
    );
  }
);

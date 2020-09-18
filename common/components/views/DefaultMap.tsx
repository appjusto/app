import React, { useRef, useCallback } from 'react';
import MapView, { PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';

interface Props extends MapViewProps {
  children?: React.ReactNode | React.ReactNode[];
  fitToElements?: boolean;
}

export default React.forwardRef(({ children, fitToElements, ...props }: Props, externalRef) => {
  const internalRef = useRef<MapView>(null);
  const ref = (externalRef as React.RefObject<MapView>) || internalRef;

  // effects
  const onMapReadyHandler = useCallback(() => {
    if (fitToElements) {
      ref.current?.fitToElements(true);
    }
  }, [ref, children, fitToElements]);

  // UI
  return (
    <MapView ref={ref} provider={PROVIDER_GOOGLE} onMapReady={onMapReadyHandler} {...props}>
      {children}
    </MapView>
  );
});

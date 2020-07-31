import React, { useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default React.forwardRef(({ children, fitToElements, ...props }, externalRef) => {
  const internalRef = useRef();
  const ref = externalRef || internalRef;

  // effects
  useEffect(() => {
    if (fitToElements) {
      ref.current.fitToElements(true);
    }
  }, [children, fitToElements]);

  // UI
  return (
    <MapView ref={ref} provider={PROVIDER_GOOGLE} {...props}>
      {children}
    </MapView>
  );
});

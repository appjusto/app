import React, { useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default React.forwardRef(({ children, fitToMarkers, ...props }, ref) => {
  // effects
  useEffect(() => {
    if (fitToMarkers) {
      ref.current.fitToElements(true);
    }
  }, [children, fitToMarkers]);

  // UI
  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      {...props}
    >
      {children}
    </MapView>
  );
});

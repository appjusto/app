import { LatLng } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useReverseGeocode = (location: LatLng | undefined) => {
  // context
  const api = React.useContext(ApiContext);
  // statre
  const [address, setAddress] = React.useState<string>();
  // side effects
  React.useEffect(() => {
    if (!location) return;
    (async () => {
      try {
        setAddress(await api.maps().googleReverseGeocode(location));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [api, location]);
  return address;
};

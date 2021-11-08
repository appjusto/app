import { LatLng } from '@appjusto/types';
import firebase from 'firebase';
import React from 'react';
import { ApiContext } from '../app/context';

export const useUpdateLocation = (profileId: string, coords: LatLng | undefined) => {
  // context
  const api = React.useContext(ApiContext);
  React.useEffect(() => {
    if (!profileId) return;
    if (!coords) return;
    const { latitude, longitude } = coords;
    const coordinates = new firebase.firestore.GeoPoint(latitude, longitude);
    api.profile().updateLocation(profileId, coordinates);
  }, [profileId, coords, api]);
};

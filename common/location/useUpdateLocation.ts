import firebase from 'firebase/compat/app';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../app/context';
import { AuthState, useAuth } from '../hooks/useAuth';
import { updateCurrentLocation, updateCurrentPlace } from '../store/consumer/actions';
import { getConsumer, getCurrentLocation, getCurrentPlace } from '../store/consumer/selectors';
import useLastKnownLocation from './useLastKnownLocation';

export const useUpdateLocation = () => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const [authState] = useAuth();
  const consumer = useSelector(getConsumer);
  const currentPlace = useSelector(getCurrentPlace);
  const currentLocation = useSelector(getCurrentLocation);
  // state
  const { coords } = useLastKnownLocation();
  // effect to update currentPlace and currentLocation
  React.useEffect(() => {
    // avoid updating during initialization
    if (!consumer && authState !== AuthState.Unsigned) return;
    // when currentPlace is set we may need only to update currentLocation
    if (currentPlace) {
      // this will happen when we use AddressComplete to set the place
      if (!currentLocation) {
        (async () => {
          const latlng = await api.maps().googleGeocode(currentPlace.address.description);
          if (latlng) dispatch(updateCurrentLocation(latlng));
        })();
      }
      return;
    }
    const lastPlace = consumer?.favoritePlaces?.find(() => true);
    // select last used place if exists
    if (lastPlace) {
      dispatch(updateCurrentPlace(lastPlace));
      dispatch(updateCurrentLocation(lastPlace.location!));
    }
    // select from current location
    else if (coords) {
      dispatch(updateCurrentLocation(coords));
    }
    // avoid updating if we did it already or we don't have the currentLoation
    if (currentPlace || !currentLocation) return;
    (async () => {
      const address = await api.maps().googleReverseGeocode(currentLocation);
      if (address)
        dispatch(
          updateCurrentPlace({
            address,
            location: coords,
          })
        );
    })();
  }, [authState, consumer, currentPlace, coords, currentLocation, api, dispatch]);
  // update consumer's location
  React.useEffect(() => {
    if (!consumer?.id) return;
    if (!coords) return;
    const { latitude, longitude } = coords;
    const coordinates = new firebase.firestore.GeoPoint(latitude, longitude);
    api.profile().updateLocation(consumer.id, coordinates).then(null);
  }, [consumer?.id, coords, api]);
};

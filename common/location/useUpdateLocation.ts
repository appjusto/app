import firebase from 'firebase';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../app/context';
import { updateCurrentLocation, updateCurrentPlace } from '../store/consumer/actions';
import { getConsumer, getCurrentLocation, getCurrentPlace } from '../store/consumer/selectors';
import useLastKnownLocation from './useLastKnownLocation';

export const useUpdateLocation = () => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const consumer = useSelector(getConsumer);
  const currentPlace = useSelector(getCurrentPlace);
  const currentLocation = useSelector(getCurrentLocation);
  // state
  const { coords } = useLastKnownLocation();
  // geocode only currentAddress is undefined
  React.useEffect(() => {
    if (currentPlace) {
      // when address is selected using AdressComplete we need to fetch location
      if (!currentLocation) {
        (async () => {
          const latlng = await api.maps().googleGeocode(currentPlace.address.description);
          if (latlng) dispatch(updateCurrentLocation(latlng));
        })();
      }
      return;
    }
    // select last used place if exists
    const lastPlace = consumer?.favoritePlaces?.find(() => true);
    if (lastPlace) {
      dispatch(updateCurrentPlace(lastPlace));
      dispatch(updateCurrentLocation(lastPlace.location!));
    }
    // select from current location
    else if (coords) {
      dispatch(updateCurrentLocation(coords));
    }
    if (currentLocation && !currentPlace) {
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
    }
  }, [consumer, currentPlace, coords, currentLocation, api, dispatch]);
  // update consumer's location
  React.useEffect(() => {
    if (!consumer?.id) return;
    if (!coords) return;
    const { latitude, longitude } = coords;
    const coordinates = new firebase.firestore.GeoPoint(latitude, longitude);
    api.profile().updateLocation(consumer.id, coordinates);
  }, [consumer?.id, coords, api]);
};

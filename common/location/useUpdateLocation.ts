import { GeoPoint } from 'firebase/firestore';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../app/context';
import { AuthState, useAuth } from '../hooks/useAuth';
import { updateCurrentLocation, updateCurrentPlace } from '../store/consumer/actions';
import { getConsumer, getCurrentLocation, getCurrentPlace } from '../store/consumer/selectors';
import useLastKnownLocation from './useLastKnownLocation';
import { useLastPlace } from './useLastPlace';

export const useUpdateLocation = () => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const [authState] = useAuth();
  const consumer = useSelector(getConsumer);
  const lastPlace = useLastPlace();
  const currentPlace = useSelector(getCurrentPlace);
  const currentLocation = useSelector(getCurrentLocation);
  // state
  const { coords } = useLastKnownLocation();
  // effect to update currentPlace and currentLocation
  React.useEffect(() => {
    // avoid updating during initialization
    if (authState === AuthState.Unsigned) {
      if (!currentLocation && coords) {
        dispatch(updateCurrentLocation(coords));
        console.log(
          'updateCurrentLocation chamada na condição if authState === AuthState.Unsigned. atualizando com coords, logando coords',
          coords
        );
      }
      return;
    } else if (authState !== AuthState.SignedIn) return;
    // when currentPlace is set we may need only to update currentLocation
    if (currentPlace) {
      // this will happen when we use AddressComplete to set the place
      if (!currentLocation) {
        if (currentPlace.location) {
          dispatch(updateCurrentLocation(currentPlace.location));
          console.log(
            'updateCurrentLocation chamada na condição if currentPlace e if !currentLocation. atualizando com e logando currentPlace.location',
            currentPlace.location
          );
        } else {
          api
            .maps()
            .googleGeocode(currentPlace.address.description)
            .then((latlng) => {
              if (!latlng) return;
              dispatch(
                updateCurrentPlace({
                  ...currentPlace,
                  location: latlng,
                })
              );
              console.log(
                'updateCurrentLocation chamada na condição if currentPlace, caso else. chama a googleGeocode, pega o latlng do currentPlace.address. logando latlng',
                latlng
              );
            });
        }
      }
      return;
    }
    // select last used place if exists
    if (lastPlace) {
      dispatch(updateCurrentPlace(lastPlace));
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
  }, [api, dispatch, authState, consumer, coords, currentPlace, currentLocation, lastPlace]);
  // update consumer's location
  React.useEffect(() => {
    if (!consumer?.id) return;
    if (!coords) return;
    const { latitude, longitude } = coords;
    const coordinates = new GeoPoint(latitude, longitude);
    api.profile().updateLocation(consumer.id, coordinates).then(null);
  }, [consumer?.id, coords, api]);
};

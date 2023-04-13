import { GeoPoint } from 'firebase/firestore';
import React from 'react';
import { Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import { AuthState, useAuth } from '../hooks/useAuth';
import { updateCurrentLocation, updateCurrentPlace } from '../store/consumer/actions';
import { getConsumer, getCurrentLocation, getCurrentPlace } from '../store/consumer/selectors';
import { showToast } from '../store/ui/actions';
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
    console.log(
      `authState: ${authState}; coords: ${coords}; currentLocation: ${currentLocation}; currentPlace: ${currentPlace}; lastPlace: ${lastPlace}`
    );
    // if unlogged
    if (authState === AuthState.Unsigned || authState === AuthState.InvalidCredentials) {
      if (!currentLocation) {
        if (coords) {
          // console.log('currentLocation falsy: atualizando para coords:', coords);
          // updating current location if not set
          dispatch(updateCurrentLocation(coords));
        } else {
          console.log('coords falsy:', coords);
          if (coords === null) {
            // defaulting to MASP location
            dispatch(
              updateCurrentLocation({
                latitude: -23.561433653472772,
                longitude: -46.65590336017428,
              })
            );
            // alert something is wrong if location permission
            Keyboard.dismiss();
            dispatch(
              showToast(
                t('Não foi possível obter sua localização. verifique suas permissões'),
                'error'
              )
            );
          }
        }
      }
      return;
    } else if (authState !== AuthState.SignedIn) return; // avoid updating during initialization
    // when currentPlace is set we may need only to update currentLocation
    if (currentPlace) {
      // this will happen when we use AddressComplete to set the place
      if (!currentLocation) {
        if (currentPlace.location) {
          // console.log(
          //   'currentLocation falsy: atualizando para currentPlace.location:',
          //   currentPlace.location
          // );
          dispatch(updateCurrentLocation(currentPlace.location));
        } else {
          // console.log(
          //   'currentLocation falsy: obtendo localização do endereço',
          //   currentPlace.address.description
          // );
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
              // console.log('atualizando currentPlace para incluir location:', latlng);
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
    // avoid updating if we did it already or we don't have the currentLocation
    if (currentPlace || !currentLocation) return;
    (async () => {
      const address = await api.maps().googleReverseGeocode(currentLocation);
      if (address)
        dispatch(
          updateCurrentPlace({
            address,
            location: coords ?? null,
          })
        );
    })();
  }, [api, dispatch, authState, coords, currentPlace, currentLocation, lastPlace]);
  // update consumer's location
  React.useEffect(() => {
    if (!consumer?.id) return;
    if (!coords) return;
    const { latitude, longitude } = coords;
    const coordinates = new GeoPoint(latitude, longitude);
    api.profile().updateLocation(consumer.id, coordinates).then(null);
  }, [consumer?.id, coords, api]);
};

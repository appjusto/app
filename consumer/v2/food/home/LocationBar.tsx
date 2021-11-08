import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { useUpdateLocation } from '../../../../common/hooks/useUpdateLocation';
import useLastKnownLocation from '../../../../common/location/useLastKnownLocation';
import {
  updateCurrentLocation,
  updateCurrentPlace,
} from '../../../../common/store/consumer/actions';
import {
  getConsumer,
  getCurrentLocation,
  getCurrentPlace,
} from '../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, texts } from '../../../../common/styles';
import { formatAddress } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

export const LocationBar = () => {
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
  useUpdateLocation(consumer!.id, coords);
  // UI
  return (
    <View
      style={{
        ...borders.default,
        backgroundColor: colors.grey50,
        width: '100%',
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 32,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons name="gps-fixed" size={16} />
        <View style={{ width: '80%', marginLeft: halfPadding }}>
          <Text style={{ ...texts.xs, flexWrap: 'wrap' }}>
            {currentPlace?.address ? formatAddress(currentPlace.address) : ''}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Trocar')}</Text>
      </View>
    </View>
  );
};

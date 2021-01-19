import React from 'react';
import { Image, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import { AppDispatch } from '../../../../common/app/context';
import useLastKnownLocation from '../../../../common/hooks/useLastKnownLocation';
import { useReverseGeocode } from '../../../../common/store/api/maps/hooks/useReverseGeocode';
import {
  updateCurrentAddress,
  updateCurrentLocation,
} from '../../../../common/store/consumer/actions';
import { getCurrentAddress, getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const currentLocation = useSelector(getCurrentLocation);
  const currentAddress = useSelector(getCurrentAddress);
  // state
  const { coords } = useLastKnownLocation();
  // geocode only currentAddress is undefined
  const lastKnownAddress = useReverseGeocode(currentAddress ? undefined : currentLocation);
  // side effects
  React.useEffect(() => {
    if (!currentAddress) {
      if (!currentLocation) {
        if (coords) dispatch(updateCurrentLocation(coords));
      }
    }
  }, [currentLocation, currentAddress, coords]);
  React.useEffect(() => {
    console.log('lastKnownAddress', lastKnownAddress);
    if (lastKnownAddress) {
      dispatch(updateCurrentAddress(lastKnownAddress));
    }
  }, [lastKnownAddress]);
  // UI
  return (
    <View
      style={{
        ...borders.default,
        backgroundColor: colors.lightGrey,
        width: '100%',
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderRadius: 32,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={icons.navigationArrow} />
        <Text style={{ ...texts.small, marginLeft: halfPadding }}>{currentAddress ?? ''}</Text>
      </View>
      <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Alterar')}</Text>
    </View>
  );
}

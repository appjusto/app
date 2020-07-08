import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Marker } from 'react-native-maps';

import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import { getConsumerLocation } from '../../../../store/selectors/consumer';

import DefaultMap from '../../../common/DefaultMap';
import { screens } from '../../../common/styles';
import { pinUser } from '../../../../assets/icons';

export default function () {
  const locationPermission = useLocationUpdates(true);
  const currentLocation = useSelector(getConsumerLocation);

  return (
    <View style={style.screen}>
      <DefaultMap
        style={style.map}
        minZoomLevel={15}
        maxZoomLevel={15}
        fitToElements
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            icon={pinUser}
          />
        )}
      </DefaultMap>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const style = StyleSheet.create({
  screen: {
    ...screens.default,
  },
  map: {
    width,
    height: height * 0.3,
  }
});
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Marker, Polyline } from 'react-native-maps';
import polyline from '@mapbox/polyline';

import DefaultMap from '../../../common/DefaultMap';
import { pinUser, pinPackage } from '../../../../assets/icons';

export default function ({ order }) {
  const { origin, destination, routePolyline } = order;

  const routeCoordinates = polyline.decode(routePolyline).map((pair) => {
    return { latitude: pair[0], longitude: pair[1] };
  });

  return (
    <DefaultMap style={style.map} minZoomLevel={13} maxZoomLevel={13} fitToElements>
      <Marker coordinate={origin.location} icon={pinPackage} />
      <Marker coordinate={destination.location} icon={pinUser} />
      <Polyline coordinates={routeCoordinates} />
    </DefaultMap>
  );
}

const style = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

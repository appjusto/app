import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Marker, Polyline } from 'react-native-maps';
import polyline from '@mapbox/polyline';

import DefaultMap from '../../../common/DefaultMap';
import { pinUser, pinPackage } from '../../../../assets/icons';

export default function ({ order }) {
  const { places, routePolyline } = order;
  const [ origin, destination ] = places;

  const originCoordinate = {
    latitude: origin.location.lat,
    longitude: origin.location.lng,
  };

  const destinationCoordinate = {
    latitude: destination.location.lat,
    longitude: destination.location.lng,
  };

  const routeCoordinates = polyline.decode(routePolyline).map((pair) => {
    return { latitude: pair[0], longitude: pair[1] };
  });

  return (
    <DefaultMap
      style={style.map}
      minZoomLevel={13}
      maxZoomLevel={13}
      fitToElements
    >
      <Marker coordinate={originCoordinate} icon={pinPackage} />
      <Marker coordinate={destinationCoordinate} icon={pinUser} />
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
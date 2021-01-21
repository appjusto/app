import polyline from '@mapbox/polyline';
import { Order } from 'appjusto-types';
import React from 'react';
import { LatLng, Marker, Polyline } from 'react-native-maps';
import DefaultMap from '../../../../common/components/views/DefaultMap';

type Props = {
  order?: Order;
};

export default function ({ order }: Props) {
  if (!order) return null;
  if (!order.origin?.location) return null;
  if (!order.destination?.location) return null;
  if (!order.route?.polyline) return null;

  const { courier, origin, destination, route } = order;

  const routeCoordinates = polyline.decode(route.polyline).map((pair) => {
    return { latitude: pair[0], longitude: pair[1] } as LatLng;
  });

  return (
    <DefaultMap
      style={{ width: '100%', height: '100%' }}
      coordinates={routeCoordinates}
      fitToElements
    >
      <Marker coordinate={origin.location!} identifier="origin" />
      <Marker coordinate={destination.location!} identifier="destination" />
      {courier?.location && <Marker coordinate={courier.location} />}
      <Polyline coordinates={routeCoordinates} />
    </DefaultMap>
  );
}

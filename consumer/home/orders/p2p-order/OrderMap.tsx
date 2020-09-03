import polyline from '@mapbox/polyline';
import React from 'react';
import { Marker, Polyline } from 'react-native-maps';

import { pinUser, pinPackage } from '../../../../assets/icons';
import DefaultMap from '../../../../common/components/DefaultMap';
import { Order } from '../../../../common/store/order/types';

type Props = {
  order: Order;
};

export default function ({ order }: Props) {
  const { origin, destination, routePolyline } = order;

  const routeCoordinates = polyline.decode(routePolyline).map((pair) => {
    return { latitude: pair[0], longitude: pair[1] };
  });

  return (
    <DefaultMap
      style={{ width: '100%', height: '100%' }}
      minZoomLevel={13}
      maxZoomLevel={13}
      fitToElements
    >
      <Marker coordinate={origin.location!} icon={pinPackage} />
      <Marker coordinate={destination.location!} icon={pinUser} />
      <Polyline coordinates={routeCoordinates} />
    </DefaultMap>
  );
}

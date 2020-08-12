import polyline from '@mapbox/polyline';
import React from 'react';
import { Marker, Polyline } from 'react-native-maps';

import { pinUser, pinPackage } from '../../../../../assets/icons';
import OrderImpl from '../../../../../store/order/types/OrderImpl';
import DefaultMap from '../../../../common/DefaultMap';

type Props = {
  order: OrderImpl;
};

export default function ({ order }: Props) {
  const { origin, destination, routePolyline } = order.getData();

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

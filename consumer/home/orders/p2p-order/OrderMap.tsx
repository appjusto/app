import polyline from '@mapbox/polyline';
import { Order } from 'appjusto-types';
import React from 'react';
import { Marker, Polyline } from 'react-native-maps';

import * as icons from '../../../../assets/icons';
import DefaultMap from '../../../../common/components/views/DefaultMap';

type Props = {
  order: Order;
};

export default function ({ order }: Props) {
  const { courierLocation, origin, destination, routePolyline } = order;

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
      <Marker coordinate={origin.location} icon={icons.pinPackageWhite} />
      <Marker coordinate={destination.location} icon={icons.pinPackage} />
      {courierLocation && <Marker coordinate={courierLocation} icon={icons.pinUser} />}
      <Polyline coordinates={routeCoordinates} />
    </DefaultMap>
  );
}

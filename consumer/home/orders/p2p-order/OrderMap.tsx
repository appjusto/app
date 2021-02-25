import polyline from '@mapbox/polyline';
import { Order } from 'appjusto-types';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { LatLng, Marker, Polyline } from 'react-native-maps';
import DefaultMap from '../../../../common/components/views/DefaultMap';
import { IconMapCourier } from '../../../../common/icons/icon-mapCourier';
import { IconMapDestination } from '../../../../common/icons/icon-mapDestination';
import { IconMapOrigin } from '../../../../common/icons/icon-mapOrigin';

type Props = {
  order?: Order;
  ratio: number;
};

export default function ({ order, ratio }: Props) {
  if (!order) return null;
  if (!order.origin?.location) return null;
  if (!order.destination?.location) return null;
  if (!order.route?.polyline) return null;

  const { width } = Dimensions.get('window');

  const { courier, origin, destination, route } = order;

  const routeCoordinates = polyline.decode(route.polyline).map((pair) => {
    return { latitude: pair[0], longitude: pair[1] } as LatLng;
  });

  return (
    <View style={{ width, height: width / ratio }}>
      <DefaultMap coordinates={routeCoordinates} fitToElements style={{ flex: 1 }}>
        <Marker coordinate={origin.location!} identifier="origin">
          <IconMapOrigin />
        </Marker>
        <Marker coordinate={destination.location!} identifier="destination">
          <IconMapDestination />
        </Marker>
        {courier?.location && (
          <Marker coordinate={courier.location}>
            <IconMapCourier />
          </Marker>
        )}
        <Polyline coordinates={routeCoordinates} />
      </DefaultMap>
    </View>
  );
}

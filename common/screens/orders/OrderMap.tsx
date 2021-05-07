import { Order } from '@appjusto/types';
import polyline from '@mapbox/polyline';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { LatLng, Marker, Polyline } from 'react-native-maps';
import DefaultMap from '../../components/views/DefaultMap';
import { IconMapCourier } from '../../icons/icon-mapCourier';
import { IconMapDestination } from '../../icons/icon-mapDestination';
import { IconMapOrigin } from '../../icons/icon-mapOrigin';

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
    <View style={{ width, height: width / ratio, alignSelf: 'center' }}>
      <DefaultMap
        coordinates={routeCoordinates}
        fitToElements
        style={{ height: '100%', width: '100%' }}
      >
        <Marker
          key={`${origin.location!.latitude}-${origin.location!.longitude}`}
          coordinate={origin.location!}
          identifier="origin"
          tracksViewChanges={false}
        >
          <IconMapOrigin />
        </Marker>
        <Marker
          key={`${destination.location!.latitude}-${destination.location!.longitude}`}
          coordinate={destination.location!}
          identifier="destination"
          tracksViewChanges={false}
        >
          <IconMapDestination />
        </Marker>
        {courier?.location && (
          <Marker
            key={`${courier.location!.latitude}-${courier.location!.longitude}`}
            coordinate={courier.location}
            tracksViewChanges={false}
          >
            <IconMapCourier />
          </Marker>
        )}
        <Polyline coordinates={routeCoordinates} />
      </DefaultMap>
    </View>
  );
}

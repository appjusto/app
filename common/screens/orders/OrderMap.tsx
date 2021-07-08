import { Order } from '@appjusto/types';
import polyline from '@mapbox/polyline';
import { FeatureCollection } from 'geojson';
import React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { Geojson, Marker } from 'react-native-maps';
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
  const { courier, origin, destination, route } = order;
  if (!origin?.location) return null;
  if (!destination?.location) return null;
  if (!route?.polyline) return null;

  const { width } = Dimensions.get('window');
  const geojson: FeatureCollection = React.useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            ...polyline.toGeoJSON(route.polyline!),
          },
        },
      ],
    }),
    [route.polyline]
  );
  // const routeCoordinates = polyline.decode(route.polyline).map((pair) => {
  //   return { latitude: pair[0], longitude: pair[1] } as LatLng;
  // });

  return (
    <View style={{ width, height: width / ratio, alignSelf: 'center' }}>
      <DefaultMap
        // coordinates={[origin.location, destination.location]}
        // coordinates={routeCoordinates}
        // fitToElements
        initialRegion={{
          ...destination.location,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
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
        {Platform.OS === 'ios' ? (
          <Geojson
            geojson={geojson}
            strokeColor="black"
            fillColor="black"
            strokeWidth={2}
            lineCap="round"
          />
        ) : null}
      </DefaultMap>
    </View>
  );
}

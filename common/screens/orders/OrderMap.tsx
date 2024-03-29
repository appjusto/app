import { Fulfillment, LatLng, OrderRoute } from '@appjusto/types';
import polyline from '@mapbox/polyline';
import React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { Marker, Polyline } from 'react-native-maps';
import DefaultMap from '../../components/views/DefaultMap';
import { IconMapCourier } from '../../icons/icon-mapCourier';
import { IconMapDestination } from '../../icons/icon-mapDestination';
import { IconMapOrigin } from '../../icons/icon-mapOrigin';
import { padding } from '../../styles';

type Props = {
  ratio: number;
  courierLocation?: LatLng | null;
  originLocation?: LatLng | null;
  destinationLocation?: LatLng | null;
  mapWidth?: string;
  mapHeigth?: number;
  route?: OrderRoute | null;
  topRadius?: boolean;
  orderFulfillment?: Fulfillment;
};

export default function ({
  ratio,
  courierLocation,
  originLocation,
  destinationLocation,
  route,
  mapWidth,
  mapHeigth,
  topRadius,
  orderFulfillment = 'delivery',
}: Props) {
  const { width } = Dimensions.get('window');
  if (!originLocation) return null;
  if (orderFulfillment === 'delivery' && !destinationLocation) return null;

  const routeCoordinates = route?.polyline
    ? polyline.decode(route.polyline).map((pair) => {
        return { latitude: pair[0], longitude: pair[1] } as LatLng;
      })
    : undefined;
  return (
    <View
      style={{
        width: mapWidth ?? width,
        height: mapHeigth ?? width / ratio,
        alignSelf: 'center',
        borderTopLeftRadius: topRadius ? padding : undefined,
        borderTopRightRadius: topRadius ? padding : undefined,
      }}
    >
      <DefaultMap
        coordinates={routeCoordinates}
        fitToElements
        initialRegion={
          destinationLocation
            ? {
                ...destinationLocation,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }
            : {
                ...originLocation,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }
        }
        style={{
          height: '100%',
          width: '100%',
          borderTopLeftRadius: topRadius ? padding : undefined,
          borderTopRightRadius: topRadius ? padding : undefined,
        }}
      >
        <Marker
          key={`${originLocation.latitude}-${originLocation.longitude}`}
          coordinate={originLocation}
          identifier="origin"
          tracksViewChanges={false}
        >
          <IconMapOrigin />
        </Marker>
        {destinationLocation ? (
          <Marker
            key={`${destinationLocation.latitude}-${destinationLocation.longitude}`}
            coordinate={destinationLocation}
            identifier="destination"
            tracksViewChanges={false}
          >
            <IconMapDestination />
          </Marker>
        ) : null}
        {courierLocation ? (
          <Marker
            key={`${courierLocation.latitude}-${courierLocation.longitude}`}
            coordinate={courierLocation}
            tracksViewChanges={false}
          >
            <IconMapCourier />
          </Marker>
        ) : null}
        {/* https://github.com/react-native-maps/react-native-maps/issues/3823 */}
        {routeCoordinates && Platform.OS === 'android' ? (
          <Polyline coordinates={routeCoordinates} lineDashPattern={[1]} />
        ) : null}
        {routeCoordinates && Platform.OS === 'ios' ? (
          <Polyline coordinates={routeCoordinates} />
        ) : null}
      </DefaultMap>
    </View>
  );
}

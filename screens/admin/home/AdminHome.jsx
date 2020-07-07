import React, { useEffect, useContext, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, FlatList, Button } from 'react-native';
import { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';

import { ApiContext } from '../../../store/api';
import { fetchAvailableCouriers, updateCourierLocation, setCourierProfile } from '../../../store/actions/courier';
import { getCourierProfile, isCourierWorking, getVisibleCouriers } from '../../../store/selectors/courier';
import DefaultMap from '../../common/DefaultMap';

const couriers = [
  { title: 'Courier 1', uid: 'courier-1' },
  { title: 'Courier 2', uid: 'courier-2' },
  { title: 'Courier 3', uid: 'courier-3' },
  { title: 'Courier 4', uid: 'courier-4' },
];

const locations = [
  { title: 'MASP', location: { coords: { latitude: -23.561178, longitude: -46.655860  }} },
  { title: 'CCBB', location: { coords: { latitude: -23.547155, longitude: -46.634532  }} },
  { title: 'Oca', location: { coords: { latitude: -23.586657, longitude: -46.655171  }} },
  { title: 'Dragão do Mar', location: { coords: { latitude: -3.721349, longitude: -38.520470 }} },
];

const defaultDeltas = {
  latitudeDelta: 0.0250,
  longitudeDelta: 0.0125,
};

export default function App({ token }) {
  // context
  const dispatch = useDispatch();
  const api = useContext(ApiContext);

  // refs
  const mapRef = useRef();

  // state
  const courier = useSelector(getCourierProfile);
  const isWorking = useSelector(isCourierWorking);
  const visibleCouriers = useSelector(getVisibleCouriers);
  const [notification, setNotification] = useState(null);
  
  // side effects
  // realtime fetch available couriers
  useEffect(() => {
    return dispatch(fetchAvailableCouriers(api));
  }, []);

  // subscribe to notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((n) => {
      setNotification(n);
    });
    return () => {
      Notifications.removeNotificationSubscription(subscription);
    };
  }, []);

  // UI
  const renderMap = () => {
    // if (!currentLocation) return null;
    const { width } = Dimensions.get('window');
    return (
      <View style={{ flex: 1 }}>
        {/* Couriers */}
        <View>
          <Text>Selected courier: {courier ? courier.uid : '' }</Text>
          <FlatList
            data={couriers}
            renderItem={({ item }) => (
              <Button
                title={item.title}
                onPress={() => dispatch(setCourierProfile({uid: item.uid}))}
              />
            )}
            keyExtractor={(item) => item.uid}
            horizontal
          />
        </View>
        {/* Locations */}
        <View>
          <Text>Location</Text>
          <Button title="Fit map" onPress={() => mapRef.current.fitToElements(true)} />
          <FlatList
            data={locations}
            renderItem={({ item }) => (
              <Button
                title={item.title}
                onPress={() => dispatch(updateCourierLocation(api)(courier, item.location, isWorking))}
              />
            )}
            keyExtractor={(item) => item.title}
            horizontal
          />
        </View>
        <TextInput style={{ marginTop: 20 }} value={token} />
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
        <DefaultMap
          style={[styles.map, { width }]}
          ref={mapRef}
          fitToMarkers
        >
          {visibleCouriers.map((courier) => (
            <Marker key={courier.uid} coordinate={courier.lastKnownLocation} />
          ))}
        </DefaultMap>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderMap()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});

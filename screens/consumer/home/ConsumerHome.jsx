import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';

import { updateLocation } from '../../../store/actions/location';
import { getCurrentLocation } from '../../../store/selectors/location';
import { isBroadcastingLocation } from '../../../store/selectors';
import { startLocationUpdatesTask } from '../../../tasks/location';

const defaultDeltas = {
  latitudeDelta: 0.0250,
  longitudeDelta: 0.0125,
};

export default function App() {
  // context
  const dispatch = useDispatch();

  // state
  const [locationPermission, setLocationPermission] = useState(null);
  const currentLocation = useSelector(getCurrentLocation);
  const shouldBroadcastLocation = useSelector(isBroadcastingLocation);

  // helpers
  const askForLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    setLocationPermission(status);
  }

  const updateWithCurrentLocation = async () => {
    const position = await Location.getCurrentPositionAsync({})
    dispatch(updateLocation(position, shouldBroadcastLocation));
  }

  // side effects
  useEffect(() => {
    askForLocation();
  }, []);

  useEffect(() => {
    if (locationPermission === 'granted') {
      updateWithCurrentLocation();
      startLocationUpdatesTask();
    }
  }, [locationPermission]);

  // UI
  const renderMap = () => {
    if (!currentLocation) return null;
    const { width } = Dimensions.get('window');
    return (
      <MapView style={[styles.map, { width }]} region={{
        ...currentLocation,
        ...defaultDeltas,
      }}>
        <Marker coordinate={currentLocation} />
      </MapView>
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

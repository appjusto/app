import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Dimensions, Button } from 'react-native';
import * as Location from 'expo-location';
import { useSelector, useDispatch } from 'react-redux';
import { Marker } from 'react-native-maps';

import { ApiContext } from '../../../store/api';
import { updateCourierStatus, updateCourierLocation } from '../../../store/actions/courier';
import { getCourierProfile, isCourierWorking, getCourierLocation } from '../../../store/selectors/courier';
import DefaultMap from '../../common/DefaultMap';
import { COURIER_STATUS_NOT_WORKING, COURIER_STATUS_AVAILABLE, COURIER_STATUS_DISPATCHING } from '../../../store/constants';
import useLocationUpdates from '../../../hooks/useLocationUpdates';

const defaultDeltas = {
  latitudeDelta: 0.0250,
  longitudeDelta: 0.0125,
};

export default function App() {
  // context
  const dispatch = useDispatch();
  const api = useContext(ApiContext);

  // state
  const courier = useSelector(getCourierProfile);
  const isWorking = useSelector(isCourierWorking);
  const locationPermission = useLocationUpdates(isWorking);
  const currentLocation = useSelector(getCourierLocation);

  // side effects
  const updateWithCurrentLocation = async () => {
    const location = await Location.getCurrentPositionAsync({})
    dispatch(updateCourierLocation(api)(courier, location, isWorking));
  }

  useEffect(() => {
    if (locationPermission === 'granted') {
      updateWithCurrentLocation();
    }
  }, [locationPermission]);

  // handlers
  const toggleWorking = () => {
    dispatch(updateCourierStatus(isWorking ? COURIER_STATUS_NOT_WORKING : COURIER_STATUS_AVAILABLE ));
  }

  // UI
  const renderMap = () => {
    if (!currentLocation) return null;
    const { width } = Dimensions.get('window');
    return (
      <DefaultMap
        style={[styles.map, { width }]}
        region={{
        ...currentLocation,
        ...defaultDeltas,
       }}
      >
        <Marker coordinate={currentLocation} />
      </DefaultMap>
    )
  }

  return (
    <View style={styles.container}>
      <View>
        <Button title={isWorking ? 'Stop working' : 'Start working'} onPress={toggleWorking} />
      </View>
      {isWorking && (
        renderMap()
      )}
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

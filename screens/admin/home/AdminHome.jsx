import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Dimensions, FlatList } from 'react-native';
import { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext } from '../../../store/api';
import { fetchVisibleCouriers, updateCourierLocation } from '../../../store/actions/courier';
import { getCourierProfile, isCourierWorking, getVisibleCouriers } from '../../../store/selectors/courier';
import DefaultMap from '../../common/DefaultMap';

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

export default function App() {
  // context
  const dispatch = useDispatch();
  const api = useContext(ApiContext);

  // state
  const courier = useSelector(getCourierProfile);
  const isWorking = useSelector(isCourierWorking);
  const visibleCouriers = useSelector(getVisibleCouriers);
  console.log(visibleCouriers);

  // side effects
  useEffect(() => {
    dispatch(fetchVisibleCouriers(api));
  }, [])

  // UI
  const renderMap = () => {
    // if (!currentLocation) return null;
    const { width } = Dimensions.get('window');
    return (
      <View style={{ flex: 1 }}>
        {/* Locations */}
        <View style={styles.rowContainer}>
          <Text>Update location</Text>
          <FlatList
            data={locations}
            renderItem={({ item }) => (
              <Item
                {...item}
                onPress={() => dispatch(updateCourierLocation(api)(courier, item.location, isWorking))}
              />
            )}
            keyExtractor={(item) => item.title}
            horizontal
          />
        </View>
        <DefaultMap style={[styles.map, { width }]}>
          {visibleCouriers.map((courier) => (
            <Marker key={courier.id} coordinate={courier.lastKnownLocation} />
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

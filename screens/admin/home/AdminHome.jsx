import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext } from '../../../store/api';
import { fetchVisibleCouriers } from '../../../store/actions/courier';
import { getVisibleCouriers } from '../../../store/selectors/courier';
import DefaultMap from '../../common/DefaultMap';


const defaultDeltas = {
  latitudeDelta: 0.0250,
  longitudeDelta: 0.0125,
};

export default function App({ token }) {
  // context
  const dispatch = useDispatch();
  const api = useContext(ApiContext);

  // state
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
        <Text>Token: {token}</Text>
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

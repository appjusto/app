import React from 'react';
import { FlatList, View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { APP_FLAVOR_CONSUMER, APP_FLAVOR_COURIER } from '../../../store/constants';
import { updateLocation } from '../../../store/actions/location';
import { setFlavor } from '../../../store/actions/config';
import { isBroadcastingLocation } from '../../../store/selectors';

const locations = [
  { title: 'MASP', location: { coords: { latitude: -23.561178, longitude: -46.655860  }} },
  { title: 'CCBB', location: { coords: { latitude: -23.547155, longitude: -46.634532  }} },
  { title: 'Oca', location: { coords: { latitude: -23.586657, longitude: -46.655171  }} },
];

const styles = StyleSheet.create({
  container: {
    marginTop: 40
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

const Item = ({ title, onPress }) => <Button title={title} onPress={onPress} />

export default function () {
  // context
  const dispatch = useDispatch();

  // state
  const shouldBroadcastLocation = useSelector(isBroadcastingLocation);

  // UI
  return (
    <View style={{ marginTop: 40 }}>
      {/* Flavor */}
      <View style={styles.rowContainer}>
        <Text>Flavor</Text>
        <Item title="Consumer" onPress={() => dispatch(setFlavor(APP_FLAVOR_CONSUMER))} />
        <Item title="Courier" onPress={() => dispatch(setFlavor(APP_FLAVOR_COURIER))} />
      </View>

      {/* Locations */}
      <View style={styles.rowContainer}>
        <Text>Locations</Text>
        <FlatList
          data={locations}
          renderItem={({ item }) => (
            <Item
              {...item}
              onPress={() => dispatch(updateLocation(item.location, shouldBroadcastLocation))}
            />
          )}
          keyExtractor={(item) => item.title}
          horizontal
        />
      </View>
    </View>
  );
}

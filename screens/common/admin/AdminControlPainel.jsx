import React, { useContext } from 'react';
import { FlatList, View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { APP_FLAVOR_ADMIN, APP_FLAVOR_CONSUMER, APP_FLAVOR_COURIER } from '../../../store/constants';
import { setFlavor } from '../../../store/actions/config';
import { ApiContext } from '../../../store/api';
import { updateCourierLocation } from '../../../store/actions/courier';
import { getCourierProfile, isCourierWorking } from '../../../store/selectors/courier';

const locations = [
  { title: 'MASP', location: { coords: { latitude: -23.561178, longitude: -46.655860  }} },
  { title: 'CCBB', location: { coords: { latitude: -23.547155, longitude: -46.634532  }} },
  { title: 'Oca', location: { coords: { latitude: -23.586657, longitude: -46.655171  }} },
  { title: 'Dragão do Mar', location: { coords: { latitude: -3.721349, longitude: -38.520470 }} },
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
  const api = useContext(ApiContext);

  // state
  const courier = useSelector(getCourierProfile);
  const isWorking = useSelector(isCourierWorking);

  // UI
  return (
    <View style={{ marginTop: 40 }}>
      {/* Flavor */}
      <View style={styles.rowContainer}>
        <Text>Flavor</Text>
        <Item title="Admin" onPress={() => dispatch(setFlavor(APP_FLAVOR_ADMIN))} />
        <Item title="Consumer" onPress={() => dispatch(setFlavor(APP_FLAVOR_CONSUMER))} />
        <Item title="Courier" onPress={() => dispatch(setFlavor(APP_FLAVOR_COURIER))} />
      </View>

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
    </View>
  );
}

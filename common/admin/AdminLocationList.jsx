import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { updateLocation } from '../../store/actions/location';
import { isBroadcastingLocation } from '../../store/selectors/location';
import { flex, colors } from '../../screens/common/styles';
import Touchable from '../../common/Touchable';

const locations = [
  { title: 'MASP', location: { coords: { latitude: -23.561178, longitude: -46.655860  }} },
];

const itemStyle = StyleSheet.create({
  container: {
    height: 100,
    ...flex.center,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.green,
  }
});

const listStyle = StyleSheet.create({
  container: {
    paddingTop: 50,
    // flex: 1,
    // flexDirection: 'row',
    // ...decoration.border,
  }
});

const Item = ({ title, onPress }) => (
  <Touchable onPress={onPress}>
    <View style={itemStyle.container}>
      <Text>{title}</Text>
    </View>
  </Touchable>
);

export default function () {
  // context
  const dispatch = useDispatch();

  // state
  const broadcastLocation = useSelector(isBroadcastingLocation);

  // UI
  return (
    <FlatList
      contentContainerStyle={listStyle.container}
      data={locations}
      renderItem={({ item }) => (
        <Item
          {...item}
          onPress={() => dispatch(updateLocation(item.location, broadcastLocation))}
        />
      )}
      keyExtractor={(item) => item.title}
      horizontal
    />
  );
}

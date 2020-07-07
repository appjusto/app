import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';

import { APP_FLAVOR_ADMIN, APP_FLAVOR_CONSUMER, APP_FLAVOR_COURIER } from '../../../store/constants';
import { setFlavor } from '../../../store/actions/config';

export default function () {
  // context
  const dispatch = useDispatch();

  // UI
  return (
    <View style={{ marginTop: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Flavor</Text>
        <Button title="Admin" onPress={() => dispatch(setFlavor(APP_FLAVOR_ADMIN))} />
        <Button title="Consumer" onPress={() => dispatch(setFlavor(APP_FLAVOR_CONSUMER))} />
        <Button title="Courier" onPress={() => dispatch(setFlavor(APP_FLAVOR_COURIER))} />
      </View>
    </View>
  );
}

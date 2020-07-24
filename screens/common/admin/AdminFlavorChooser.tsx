import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';

import { setFlavor } from '../../../store/actions/config';

export default function () {
  // context
  const dispatch = useDispatch();

  // UI
  return (
    <View style={{ marginTop: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Flavor</Text>
        <Button title="Admin" onPress={() => dispatch(setFlavor('admin'))} />
        <Button title="Consumer" onPress={() => dispatch(setFlavor('consumer'))} />
        <Button title="Courier" onPress={() => dispatch(setFlavor('courier'))} />
      </View>
    </View>
  );
}

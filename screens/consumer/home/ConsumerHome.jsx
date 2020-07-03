import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { getOngoingOrders } from '../../../store/selectors/consumer';


export default function App() {
  // context
  const dispatch = useDispatch();

  // state
  const ongoingOrders = useSelector(getOngoingOrders);

  return (
    <View style={styles.container}>
      <Text># of ongoing orders: {ongoingOrders.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { goArrow } from '../../assets/icons';

const GoButton = ({ ...props }) => (
  <View style={styles.container} {...props}>
    <Image source={goArrow} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 32,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#F2F7EA',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoButton;

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { goArrow } from '../../assets/icons';

const GoButton = ({ ...props }) => (
  <TouchableOpacity {...props}>
    <View style={styles.container}>
      <Image source={goArrow} />
    </View>
  </TouchableOpacity>
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

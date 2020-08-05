import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { arrowBack } from '../../assets/icons';
import { colors } from './styles';

const BackButton = ({ ...props }) => (
  <TouchableOpacity {...props}>
    <View style={styles.imgContainer}>
      <Image source={arrowBack} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  imgContainer: {
    height: 32,
    width: 32,
    backgroundColor: 'white',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton;

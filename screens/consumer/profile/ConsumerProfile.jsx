import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {colors, texts} from '../../common/styles';

const ConsumerProfile = () => {
  return (
    <View style={styles.screen}>
      <Text>Sua conta</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.lightGrey,
  },
});

export default ConsumerProfile;

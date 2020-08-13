import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import { borders, texts, screens, colors } from '../../common/styles';

export default function ({ name, participants, description }) {
  return (
    <View style={styles.box}>
      <Text style={{ ...texts.default }}>{name}</Text>
      <Text style={{ ...texts.small, marginTop: 4, color: colors.darkGreen }}>{participants}</Text>
      <Text style={{ ...texts.small, marginTop: 12, height: 54, color: colors.darkGrey }}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: 243,
    ...borders.default,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
});

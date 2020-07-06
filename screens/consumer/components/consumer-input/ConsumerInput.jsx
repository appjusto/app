import React from 'react';
import { View, Text, Input, StyleSheet } from 'react-native';

import RegularButton from '../regular-button/RegularButton';
import { t } from '../../../../strings';

export default function ConsumerInput({ hasButton }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>Teste</Text>
        <Input />
      </View>
      {hasButton && <RegularButton>{t('enter')}</RegularButton>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 61,
    borderRadius: 8,
    borderStyle: 'solid',
    borderColor: '#C8D7CB',
    borderWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  inputContainer: {},
  text: {
    fontSize: 13,
    lineHeight: 16,
    color: '#63B745',
    paddingVertical: 2,
  },
});

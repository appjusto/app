import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import RegularButton from '../regular-button/RegularButton';
import { t } from '../../../../strings';

const DeafaultInput = ({ actionButton, title, placeholder, onChange, value, ...props }) => (
  <View style={styles.container}>
    <View style={styles.inputContainer}>
      <Text style={styles.text}>{title}</Text>
      <TextInput placeholder={placeholder} onChange={onChange} value={value} {...props} />
    </View>
    {actionButton && <RegularButton>{t('enter')}</RegularButton>}
  </View>
);

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
    alignItems: 'center',
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

export default DeafaultInput;

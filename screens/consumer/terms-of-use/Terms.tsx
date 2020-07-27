import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { texts, colors } from '../../common/styles';
import { t } from '../../../strings';

export default function Terms() {
  return (
    <View style={styles.screen}>
      <Text style={styles.bigText}>{t('Termos de uso e política de privacidade')}</Text>
      <Text style={styles.terms}>Lorem</Text>
      <Text style={styles.terms}>Lorem</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  bigText: {
    ...texts.big,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  terms: {
    ...texts.default,
    color: colors.darkGrey,
    marginHorizontal: 16,
  },
});

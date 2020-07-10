import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { texts } from '../../common/styles';
import { t } from '../../../strings';

export default function Terms() {
  return (
    <View style={styles.screen}>
      <Text style={styles.bigText}>
        {t('Termos de uso e política de privacidade')}
      </Text>
      <Text style={styles.terms}>Lorem</Text>
      <Text style={styles.terms}>Lorem</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F7EA',
  },
  bigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
    ...texts.default,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  terms: {
    fontSize: 15,
    lineHeight: 18,
    color: '#697667',
    ...texts.default,
    marginHorizontal: 16,
  },
});

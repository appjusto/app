import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { t } from '../../../strings';

export default function ConsumerIntro() {
  return (
    <View style={styles.screen}>
      <View style={styles.containerBigText}>
        <Text style={styles.BigText}>{t('weAre')}</Text>
        <View style={styles.containerMediumText}>
          <Text style={styles.mediumText}>
            {t('platform')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerBigText: {
    width: '100%',
    height: 58,
    alignItems: 'flex-start',
  },
  BigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
  },
  containerMediumText: {
    width: '85%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 16,
    // marginRight: 24,
  },
  mediumText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#697667',
  },
});

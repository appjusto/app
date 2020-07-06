import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import ConsumerInput from '../components/consumer-input/ConsumerInput'
import { t } from '../../../strings';
import { app, justo } from '../../../assets/icons';

export default function ConsumerIntro() {
  return (
    <View style={styles.screen}>
      <View style={styles.greenCircle} />
      <View style={styles.imageContainer}>
        <Image source={app} style={styles.app} />
        <Image source={justo} style={styles.justo} />
      </View>
      <View style={styles.containerBigText}>
        <Text style={styles.BigText}>{t('weAre')}</Text>
      </View>
      <View style={styles.containerMediumText}>
        <Text style={styles.mediumText}>{t('platform')}</Text>
      </View>
      {/* <ConsumerInput hasButton /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  greenCircle: {
    width: 160,
    height: 160,
    borderRadius: 160 / 2,
    backgroundColor: '#78E08F',
    alignSelf: 'flex-end',
  },
  imageContainer: {
    marginTop: 41,
  },
  app: {
    width: '24,6%',
    height: 27.15,
    position: 'absolute',
  },
  justo: {
    width: '42,4%',
    height: 53.32,
  },
  containerBigText: {
    width: '100%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 16,
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
    marginVertical: 16,
    // marginRight: 24,
  },
  mediumText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#697667',
  },
});

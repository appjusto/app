import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import DefaultInput from '../components/default-input/DefaultInput';
import { t } from '../../../strings';
import { logoWhite } from '../../../assets/icons';

export default function ConsumerIntro() {
  return (
    <View style={styles.screen}>
      <View style={styles.greenCircle} />
      <View style={styles.imageContainer}>
        <Image source={logoWhite} style={styles.logo} />
      </View>
      <View style={styles.containerBigText}>
        <Text style={styles.BigText}>{t('weAre')}</Text>
      </View>
      <View style={styles.containerMediumText}>
        <Text style={styles.mediumText}>{t('platform')}</Text>
      </View>
      <DefaultInput
        actionButton
        title={t('access')}
        // keyboardType='numeric'
        placeholder={t('cellPhone')}
      />
      <View style={styles.enterEmail}>
        <View style={styles.littleCircle} />
        <Text style={styles.emailText}>{t('yourEmail')}</Text>
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
  logo: {
    width: '46,5%',
    height: 74,
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
  enterEmail: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    height: 18,
    marginTop: 16,
  },
  littleCircle: {
    height: 4,
    width: 4,
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#63B745',
    // bottom: 7,
  },
  emailText: {
    fontSize: 15,
    lineHeight: 18,
    marginLeft: 4,
  },
});

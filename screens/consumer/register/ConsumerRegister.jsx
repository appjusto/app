import React from 'react';
import {
  View,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
} from 'react-native';

import * as fonts from '../../../assets/fonts';
import {colors} from '../../common/styles'

const ConsumerRegister = () => {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.containerBigText}>
        <Text style={styles.bigText}>{t('soon')}</Text>
      </View>
      <View style={styles.containerMediumText}>
        <Text style={styles.mediumText}>{t('platform')}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  containerBigText: {
    width: '90%',
    height: 58,
    alignItems: 'flex-start',
  },
  bigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
    fontFamily: fonts.BarlowMedium,
  },
  containerMediumText: {
    width: '85%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  mediumText: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.darkGrey,
    fontFamily: fonts.BarlowMedium,
  },
});

export default ConsumerRegister;

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { t } from '../../../strings';
import * as fonts from '../../../assets/fonts';
import { colors } from '../../common/styles';

const ConsumerConfirmation = ({ navigation, route }) => {
  const { path } = route.params;
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  if (path === 'sms') {
    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.containerBigText}>
          <Text style={styles.bigText}>{t('confirmationCode')}</Text>
        </View>
        <DefaultInput
          title={t('code')}
          placeholder={t('typeCode')}
          value={code}
          onChangeText={setCode}
          // keyboardType='numeric'
          blurOnSubmit
        >
          <DefaultButton title={t('enter')} disabled={code.length === 0} />
        </DefaultInput>
        <TouchableOpacity style={styles.tb}>
          <View style={styles.sendAgain}>
            <View style={styles.littleCircle} />
            <Text style={styles.sendAgainText}>{t('sendAgain')}</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.containerBigText}>
        <Text style={styles.bigText}>{t('linkEmail')}</Text>
      </View>
      <DefaultInput
        title={t('email')}
        placeholder={t('typeEmail')}
        value={email}
        onChangeText={setEmail}
        // keyboardType='numeric'
        blurOnSubmit
      >
        <DefaultButton title={t('send')} disabled={code.length === 0} />
      </DefaultInput>
      <TouchableOpacity style={styles.tb}>
        <View style={styles.sendAgain}>
          <View style={styles.littleCircle} />
          <Text style={styles.sendAgainText}>{t('sendAgain')}</Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: colors.lightGrey,
  },
  containerBigText: {
    width: '85%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 182,
    marginBottom: 16,
  },
  bigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
    fontFamily: fonts.BarlowMedium,
  },
  tb: {
    alignSelf: 'center',
    height: 18,
    marginTop: 16,
  },
  sendAgain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  littleCircle: {
    height: 4,
    width: 4,
    borderRadius: 4 / 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#63B745',
  },
  sendAgainText: {
    fontSize: 15,
    lineHeight: 18,
    marginLeft: 4,
    fontFamily: fonts.BarlowMedium,
  },
});

export default ConsumerConfirmation;

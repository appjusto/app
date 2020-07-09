import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text
} from 'react-native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { t } from '../../../strings';
import * as fonts from '../../../assets/fonts'

const ConsumerConfirmation = () => {
  const [code, setCode] = useState('');
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
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
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 16,
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

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
import ShowIf from '../../common/ShowIf';
import { t } from '../../../strings';
// import * as fonts from '../../../assets/fonts';
import { colors, texts } from '../../common/styles';

const ConsumerConfirmation = ({ navigation, route }) => {
  const { path } = route.params;
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sendAgain, setSendAgain] = useState('false') //just for now

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
          <DefaultButton
            title={t('enter')}
            disabled={code.length === 0}
            onPress={() => navigation.navigate('ConsumerRegistration')}
          />
        </DefaultInput>
        <TouchableOpacity style={styles.tb} onPress={() => setSendAgain(!sendAgain)}>
          <View style={styles.sendAgain}>
            <View style={styles.littleCircle} />
            <Text style={styles.sendAgainText}>{t('sendAgain')}</Text>
          </View>
        </TouchableOpacity>
        <ShowIf test={sendAgain === true}>
        <View style={styles.yellowBox}>
          <Text style={styles.yellowText}>
            {t('Código enviado com sucesso. Verifique sua caixa de mensagens')}
          </Text>
        </View>
      </ShowIf>
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
        <DefaultButton
          title={t('send')}
          disabled={code.length === 0}
          onPress={() => navigation.navigate('ConsumerRegistration')}
        />
      </DefaultInput>
      <TouchableOpacity style={styles.tb} onPress={() => setSendAgain(!sendAgain)}>
        <View style={styles.sendAgain}>
          <View style={styles.littleCircle} />
          <Text style={styles.sendAgainText}>{t('sendAgain')}</Text>
        </View>
      </TouchableOpacity>
      <ShowIf test={sendAgain === true}>
        <View style={styles.yellowBox}>
          <Text style={styles.yellowText}>
            {t('Link enviado com sucesso. Verifique seu e-mail.')}
          </Text>
        </View>
      </ShowIf>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
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
    ...texts.default,
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
    ...texts.default,
  },
  yellowBox: {
    marginTop: '50%',
    height: 40,
    width: '100%',
    backgroundColor: '#FFBE00',
    borderColor: '#FFBE00',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yellowText: {
    ...texts.default,
    fontSize: 13,
    lineHeight: 16,
  },
});

export default ConsumerConfirmation;

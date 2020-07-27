import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import ShowIf from '../../common/ShowIf';
import { t } from '../../../strings';
// import * as fonts from '../../../assets/fonts';
import { colors, texts } from '../../common/styles';

const ConsumerConfirmation = () => {
  // context
  const navigation = useNavigation();
  const route = useRoute();
  const path: string = route.params;

  // state
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sendAgain, setSendAgain] = useState(false); //just for now

  if (path === 'sms') {
    //needs refactoring because of the new approach to the KeyboardAvoidingView
    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.containerBigText}>
          <Text style={{ ...texts.big }}>
            {t('Um código de acesso foi enviado para o seu número.')}
          </Text>
        </View>
        <DefaultInput
          title={t('Código de confirmação')}
          placeholder={t('Digite o código')}
          value={code}
          onChangeText={setCode}
          // keyboardType='numeric'
          blurOnSubmit
        >
          <DefaultButton
            title={t('Entrar')}
            disabled={code.length === 0}
            onPress={() => navigation.navigate('ConsumerRegistration')}
          />
        </DefaultInput>
        <TouchableOpacity style={styles.tb} onPress={() => setSendAgain(!sendAgain)}>
          <View style={styles.sendAgain}>
            <View style={styles.littleCircle} />
            <Text style={{ ...texts.default, marginLeft: 4 }}>
              {t('Enviar confirmação novamente')}
            </Text>
          </View>
        </TouchableOpacity>
        <ShowIf test={sendAgain === true}>
          {() => (
            <View style={styles.yellowBox}>
              <Text style={{ ...texts.small }}>
                {t('Código enviado com sucesso. Verifique sua caixa de mensagens')}
              </Text>
            </View>
          )}
        </ShowIf>
      </KeyboardAvoidingView>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.containerBigText}>
        <Text style={{ ...texts.big }}>
          {t('Enviaremos um link de confirmação para o seu e-mail.')}
        </Text>
      </View>
      <DefaultInput
        title={t('E-mail')}
        placeholder={t('Digite seu e-mail')}
        value={email}
        onChangeText={setEmail}
        // keyboardType='numeric'
        blurOnSubmit
      >
        <DefaultButton
          title={t('Enviar')}
          disabled={code.length === 0}
          onPress={() => navigation.navigate('ConsumerRegistration')}
        />
      </DefaultInput>
      <TouchableOpacity style={styles.tb} onPress={() => setSendAgain(!sendAgain)}>
        <View style={styles.sendAgain}>
          <View style={styles.littleCircle} />
          <Text style={{ ...texts.default, marginLeft: 4 }}>
            {t('Enviar confirmação novamente')}
          </Text>
        </View>
      </TouchableOpacity>
      <ShowIf test={sendAgain === true}>
        {() => (
          <View style={styles.yellowBox}>
            <Text style={{ ...texts.small }}>
              {t('Link enviado com sucesso. Verifique seu e-mail.')}
            </Text>
          </View>
        )}
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
});

export default ConsumerConfirmation;

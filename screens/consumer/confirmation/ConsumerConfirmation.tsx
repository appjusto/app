import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { t } from '../../../strings';
import { colors, texts } from '../../common/styles';
import AvoidingView from '../../common/AvoidingView';
import { motocycle } from '../../../assets/icons';

const ConsumerConfirmation = () => {
  // context
  const navigation = useNavigation();
  const route = useRoute();
  // const path: string = route.params;

  // state
  const [code, setCode] = useState('');
  const [sendAgain, setSendAgain] = useState(false); //just for now

  //needs refactoring because of the new approach to the KeyboardAvoidingView and the Keyboard.dismiss() method
  if (sendAgain) {
    return (
      <View style={styles.screen}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', width: '75%' }}>
            <Text style={{ ...texts.big }}>{t('Enviamos um link de')}</Text>
            <Text style={{ ...texts.big }}>{t('confirmação para você.')}</Text>
            <View style={{ height: 114, width: 114, marginTop: 22, marginBottom: 16 }}>
              <Image source={motocycle} />
            </View>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>
              {t('Continue o acesso usando seu e-mail')}
            </Text>
          </View>
        </View>
        <DefaultButton
          title={t('Enviar confirmação novamente')}
          onPress={() => {
            setSendAgain(!sendAgain);
          }}
          styleObject={{
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000',
            backgroundColor: 'white',
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AvoidingView style={{ flex: 1 }}>
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
      </AvoidingView>
      <View style={{ flex: 1 }} />
      <DefaultButton
        title={t('Enviar confirmação novamente')}
        onPress={() => {
          setSendAgain(!sendAgain);
        }}
        styleObject={{
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#000',
          backgroundColor: 'white',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.lightGrey,
    marginBottom: 16,
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

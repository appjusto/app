import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { t } from '../../../strings';
import { logoWhite, arrow, illustration } from '../../../assets/icons';
import { colors, texts, borders, padding, screens } from '../../common/styles';

export default function ConsumerIntro({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <View style={[screens.default, { marginBottom: 0 }]}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View style={{ paddingHorizontal: padding}}>

                <View style={{ width: '55.5%', height: 200, alignSelf: 'flex-start' }}>
                  <Image source={illustration} />
                </View>
              
                <View style={{ height: 74, marginTop: 41 }}>
                  <Image style={{ width: '46.5%', height: 74 }} source={logoWhite} />
                </View>

                <View style={{ width: '100%', height: 58, alignItems: 'flex-start', marginTop: 16 }}>
                  <Text style={[texts.big]}>{t('Somos um delivery aberto, transparente e consciente.')}</Text>
                </View>

                <View style={{ width: '85%', height: 58, alignItems: 'flex-start', marginVertical: 16}}>
                  <Text style={[texts.default, { color: colors.darkGrey }]}>{t('A plataforma de entregas mais justa, transparente e aberta disponível.')}</Text>
                </View>

                <DefaultInput
                  value={email}
                  title={t('Acesse sua conta')}
                  placeholder={t('Digite seu e-mail')}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  blurOnSubmit
                >
                  <DefaultButton
                    disabled={email.length === 0}
                    title={t('Entrar')}
                    onPress={() =>
                      navigation.navigate('ConsumerConfirmation', { path: 'sms' })
                    }
                  />
                </DefaultInput>
              </View>

              <View style={{ flex: 1 }} />
              
              {/* sign up */}
              <View style={styles.bottomContainer}>
                <View style={styles.innerContainer}>
                  <View style={{ width: 150 }}>
                    <Text style={[texts.default]} numberOfLines={2}>
                      {t('Faça parte desse movimento')}
                      <Image source={arrow} width={11} height={4} />
                    </Text>
                  </View>
                  <DefaultButton
                    title={t('Cadastre-se agora')}
                    onPress={() => navigation.navigate('ConsumerRegistration')}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    backgroundColor: colors.lightGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  innerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
});

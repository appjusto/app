import React, { useState } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';

import CheckField from '../../common/CheckField';
import { t } from '../../../strings';
import { colors, texts } from '../../common/styles';
import { checkboxActive, checkboxInactive } from '../../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const ConsumerRegistration = () => {
  // context
  const navigation = useNavigation();

  // state
  const [acceptedTerms, setAcceptTerms] = useState(false);
  const [acceptedMarketing, setAcceptMarketing] = useState(false);
  
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.containerBigText}>
        <Text style={styles.bigText}>
          {t('Assim que sua conta for criada você já poderá fazer pedidos.')}
        </Text>
      </View>
      <View style={styles.containerMediumText}>
        <Text style={styles.mediumText}>
          {t(
            'E fique tranquilo: todos os seus dados estarão protegidos conosco.'
          )}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <DefaultInput title={t('Nome')} placeholder={t('Qual o seu nome?')} />
      </View>
      <View style={styles.inputContainer}>
        <DefaultInput
          title={t('Sobrenome')}
          placeholder={t('Qual o seu sobrenome?')}
        />
      </View>
      <View style={styles.inputContainer}>
        <DefaultInput
          title={t('Celular')}
          placeholder={t('Qual o seu número?')}
        />
      </View>
      <View style={styles.inputContainer}>
        <DefaultInput
          title={t('E-mail')}
          placeholder={t('Qual o seu email?')}
        />
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <CheckField
          marginTop={12}
          source={acceptedTerms ? checkboxActive : checkboxInactive}
          onPress={() => setAcceptTerms(!acceptedTerms)}
          text={t('Aceito os termos de uso e a política de privacidade')}
        />
        <CheckField
          marginTop={12}
          source={acceptedMarketing ? checkboxActive : checkboxInactive}
          onPress={() => setAcceptMarketing(!acceptedMarketing)}
          text={t('Aceito receber comunicações e ofertas')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <DefaultButton
          disabled
          title={t('Ler termos de uso')}
          onPress={() => navigation.navigate('Terms')}
        />
        <DefaultButton
          wide
          title={t('Cadastrar')}
          onPress={() => navigation.replace('Logged')}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  containerBigText: {
    width: '90%',
    height: 58,
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 16,
  },
  bigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
    ...texts.default,
  },
  containerMediumText: {
    width: '85%',
    height: 40,
    alignItems: 'flex-start',
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 32,
    // borderColor: 'red',
    // borderStyle: 'solid',
    // borderWidth: 1,
  },
  mediumText: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.darkGrey,
    ...texts.default,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  checkContainer: {
    width: '100%',
    marginHorizontal: 16,
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
  },
  checkText: {
    ...texts.default,
    fontSize: 13,
    lineHeight: 16,
    marginLeft: 8,
  },
  image: {
    height: 24,
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 32,
    height: 48,
    justifyContent: 'space-between',
  },
});

export default ConsumerRegistration;

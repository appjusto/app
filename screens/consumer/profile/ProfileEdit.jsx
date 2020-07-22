import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
} from 'react-native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { colors, texts, screens } from '../../common/styles';
import { checkboxActive, checkboxInactive } from '../../../assets/icons';
import { t } from '../../../strings';

const ProfileEdit = () => {
  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            <View style={styles.texts}>
              <Text style={styles.big}>{t('Seus dados')}</Text>
              <Text style={styles.default}>
                {t('Edite seus dados pessoais:')}
              </Text>
            </View>
            <View style={styles.inputs}>
              <DefaultInput
                title={t('Nome')}
                value={name}
                onChangeText={setName}
              />
              <DefaultInput
                style={{ marginTop: 12 }}
                title={t('Sobrenome')}
                value={surname}
                onChangeText={setSurname}
              />
              <DefaultInput
                style={{ marginTop: 12 }}
                title={t('Celular')}
                value={phone}
                onChangeText={setPhone}
              />
              <DefaultInput
                style={{ marginTop: 12 }}
                title={t('E-mail')}
                value={email}
                onChangeText={setEmail}
              />
              <DefaultInput
                style={{ marginTop: 12 }}
                title={t('CPF')}
                value={cpf}
                onChangeText={setCpf}
              />
            </View>
            <View style={styles.checkContainer}>
              <TouchableOpacity onPress={toggleCheckBox}>
                <Image
                  source={isChecked ? checkboxActive : checkboxInactive}
                  style={styles.image}
                />
              </TouchableOpacity>
              <Text style={styles.checkText}>
                {t('Aceito receber comunicações e ofertas')}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <DefaultButton
                title={t('Atualizar')}
                disabled={
                  name.length === 0 ||
                  surname.length === 0 ||
                  phone.length === 0 ||
                  email.length === 0 ||
                  cpf.length === 0
                }
                onPress={() => {}}
              />
              <View>
                <Image />
                <Text></Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...screens.lightGrey,
  },
  texts: {
    marginTop: 16,
  },
  big: {
    ...texts.big,
  },
  default: {
    ...texts.default,
    color: colors.darkGrey,
    paddingTop: 8,
  },
  inputs: {
    marginTop: 32,
  },
  checkContainer: {
    // width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkText: {
    ...texts.small,
    marginLeft: 8,
  },
  image: {
    height: 24,
    width: 24,
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    marginTop: 42,
  },
});

export default ProfileEdit;

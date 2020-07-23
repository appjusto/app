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

import CheckField from '../../common/CheckField';
import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { colors, texts, screens } from '../../common/styles';
import { checkboxActive, checkboxInactive, erase } from '../../../assets/icons';
import { t } from '../../../strings';

const ProfileEdit = ({ navigation }) => {
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
    <View style={{ ...screens.lightGrey, marginBottom: 0 }}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <View style={{ marginTop: 16 }}>
                <Text style={{ ...texts.big }}>{t('Seus dados')}</Text>
                <Text style={styles.default}>
                  {t('Edite seus dados pessoais:')}
                </Text>
              </View>
              <View style={{ marginTop: 32 }}>
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
              <CheckField
                marginTop={16}
                source={isChecked ? checkboxActive : checkboxInactive}
                onPress={toggleCheckBox}
                text={t('Aceito receber comunicações e ofertas')}
              />
              <View style={{ flex: 1 }} />
              <View style={styles.bottomContainer}>
                <DefaultButton
                  wide
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
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileErase')}
                >
                  <View style={styles.eraseContainer}>
                    <Image source={erase} />
                    <Text style={{ ...texts.small, marginLeft: 6 }}>
                      {t('Excluir minha conta')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    ...texts.default,
    color: colors.darkGrey,
    paddingTop: 8,
  },
  checkContainer: {
    // width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    marginTop: 42,
    justifyContent: 'space-between',
  },
  eraseContainer: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
});

export default ProfileEdit;

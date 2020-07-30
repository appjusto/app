import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { erase } from '../../../assets/icons';
import { updateConsumer } from '../../../store/actions/consumer';
import { showToast } from '../../../store/actions/ui';
import { getConsumer } from '../../../store/selectors/consumer';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../../utils/context';
import AvoidingView from '../../common/AvoidingView';
import CheckField from '../../common/CheckField';
import DefaultButton from '../../common/DefaultButton';
import DefaultInput from '../../common/DefaultInput';
import { colors, texts, screens } from '../../common/styles';

const ProfileEdit = () => {
  // context
  const navigation = useNavigation();
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const consumer = useSelector(getConsumer);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState<string>(consumer?.name ?? '');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // handlers
  const toggleAcceptMarketing = useCallback(() => {
    setAcceptMarketing(!acceptMarketing);
  }, [acceptMarketing]);

  const updateConsumerHandler = async () => {
    setUpdating(true);
    dispatch(showToast(t('Atualizando cadastro...')));
    await updateConsumer(api)(consumer!.id, {
      name,
      surname,
      phone,
      email,
      cpf,
      acceptMarketing,
    });
    navigation.goBack();
  };

  // UI
  return (
    <View style={{ ...screens.lightGrey, marginBottom: 0 }}>
      <View style={{ flex: 1 }}>
        <AvoidingView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <View style={{ marginTop: 16 }}>
                <Text style={{ ...texts.big }}>{t('Seus dados')}</Text>
                <Text style={styles.default}>{t('Edite seus dados pessoais:')}</Text>
              </View>
              <View style={{ marginTop: 32 }}>
                <DefaultInput title={t('Nome')} value={name} onChangeText={setName} />
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
                checked={acceptMarketing}
                onPress={toggleAcceptMarketing}
                text={t('Aceito receber comunicações e ofertas')}
              />
              <View style={{ flex: 1 }} />
              <View style={styles.bottomContainer}>
                <DefaultButton
                  wide
                  title={t('Atualizar')}
                  disabled={updating}
                  onPress={updateConsumerHandler}
                />
                <TouchableOpacity onPress={() => navigation.navigate('ProfileErase')}>
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
        </AvoidingView>
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

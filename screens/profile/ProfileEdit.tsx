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

import { erase } from '../../assets/icons';
import { getFlavor } from '../../store/config/selectors';
import { updateConsumer } from '../../store/consumer/actions';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';
import { showToast } from '../../store/ui/actions';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import AvoidingView from '../common/AvoidingView';
import CheckField from '../common/CheckField';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import { colors, texts, screens } from '../common/styles';
import { updateCourier } from '../../store/courier/actions';
import { ScrollView } from 'react-native-gesture-handler';

const ProfileEdit = () => {
  // context
  const navigation = useNavigation();
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const flavor = useSelector(getFlavor);
  const user = useSelector(flavor === 'consumer' ? getConsumer : getCourier);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState<string>(user?.name ?? '');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // handlers
  const updateUser = flavor === 'consumer' ? updateConsumer : updateCourier;
  const toggleAcceptMarketing = useCallback(() => {
    setAcceptMarketing(!acceptMarketing);
  }, [acceptMarketing]);

  const updateUserHander = async () => {
    setUpdating(true);
    dispatch(showToast(t('Atualizando cadastro...')));
    await updateUser(api)(user!.id, {
      name,
      surname,
      phone,
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
          <ScrollView>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ marginTop: 16 }}>
                <Text style={[texts.big]}>{t('Seus dados')}</Text>
                <Text style={[texts.default, { color: colors.darkGrey, paddingTop: 8 }]}>
                  {t('Edite seus dados pessoais:')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
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
                title={t('CPF')}
                value={cpf}
                onChangeText={setCpf}
              />
              <DefaultInput
                style={{ marginTop: 12 }}
                title={t('Celular')}
                value={phone}
                onChangeText={setPhone}
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
                onPress={updateUserHander}
              />
              <TouchableOpacity onPress={() => navigation.navigate('ProfileErase')}>
                <View style={styles.eraseContainer}>
                  <Image source={erase} />
                  <Text style={{ ...texts.small, marginLeft: 6 }}>{t('Excluir minha conta')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </AvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

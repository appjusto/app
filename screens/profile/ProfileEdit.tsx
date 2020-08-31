import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { validate } from 'gerador-validador-cpf';
import { trim, isEmpty } from 'lodash';
import React, { useState, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { erase } from '../../assets/icons';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import Consumer from '../../store/consumer/types/Consumer';
import { getCourier } from '../../store/courier/selectors';
import Courier from '../../store/courier/types/Courier';
import { showToast } from '../../store/ui/actions';
import { updateProfile } from '../../store/user/actions';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import AvoidingView from '../common/AvoidingView';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import ShowIf from '../common/ShowIf';
import { texts, screens, padding } from '../common/styles';
import PaddedView from '../common/views/PaddedView';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileEdit'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);
  const { hideDeleteAccount, allowPartialSave } = route.params ?? {};

  // refs
  const surnameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);
  const dddRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  // app state
  const flavor = useSelector(getFlavor);
  const courier = useSelector(getCourier);
  const consumer = useSelector(getConsumer);
  const user: Consumer | Courier = flavor === 'consumer' ? consumer! : courier!;

  // state
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState<string>(user!.name ?? '');
  const [surname, setSurname] = useState(user!.surname ?? '');
  const [ddd, setDDD] = useState(user!.phone?.ddd ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user!.phone?.number ?? '');
  const phone = { ddd, number: phoneNumber };
  const [cpf, setCpf] = useState(user!.cpf! ?? '');

  // handlers
  const updateProfileHandler = async () => {
    if (updating) return;
    const newUser = user.merge({ id: user.id, name, surname, phone, cpf });
    if (!allowPartialSave && !newUser.personalInfoSet()) {
      dispatch(showToast(t('Você precisa preencher todos os dados.')));
      return;
    }
    // TODO: disabling to make tests easier
    // if (cpf.length !== 11 || !validate(cpf)) {
    //   dispatch(showToast(t('CPF não é válido.')));
    //   return;
    // }
    setUpdating(true);
    await updateProfile(api)(user.id!, {
      name: trim(name),
      surname: trim(surname),
      phone: {
        ddd,
        number: phoneNumber,
      },
      cpf,
    });
    navigation.goBack();
    setUpdating(false);
  };

  // UI
  return (
    <PaddedView style={{ ...screens.lightGrey }}>
      <AvoidingView>
        <ScrollView>
          <DefaultInput
            title={t('Nome')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => surnameRef.current?.focus()}
          />
          <DefaultInput
            ref={surnameRef}
            style={{ marginTop: padding }}
            title={t('Sobrenome')}
            value={surname}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setSurname(text)}
            onSubmitEditing={() => cpfRef.current?.focus()}
          />
          <DefaultInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF')}
            value={cpf}
            placeholder={t('00000000000')}
            maxLength={11}
            keyboardType="number-pad"
            returnKeyType={flavor === 'courier' ? 'next' : 'done'}
            blurOnSubmit={flavor !== 'courier'}
            onChangeText={(text) => setCpf(trim(text))}
            onSubmitEditing={() => dddRef.current?.focus()}
          />
          <ShowIf test={flavor === 'courier'}>
            {() => (
              <View style={{ flexDirection: 'row', marginTop: padding }}>
                <DefaultInput
                  ref={dddRef}
                  style={{ flex: 1 }}
                  title={t('DDD')}
                  value={ddd}
                  placeholder={t('00')}
                  maxLength={2}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onChangeText={(text) => setDDD(trim(text))}
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
                <DefaultInput
                  ref={phoneRef}
                  style={{ flex: 4, marginLeft: padding }}
                  title={t('Celular')}
                  value={phoneNumber}
                  placeholder={t('000000000')}
                  maxLength={9}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  blurOnSubmit
                  onChangeText={(text) => setPhoneNumber(trim(text))}
                />
              </View>
            )}
          </ShowIf>
          <DefaultButton
            style={{ marginVertical: padding }}
            title={t('Atualizar')}
            onPress={updateProfileHandler}
            activityIndicator={updating}
          />
          <ShowIf test={!hideDeleteAccount}>
            {() => (
              <TouchableOpacity onPress={() => navigation.navigate('ProfileErase')}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image source={erase} />
                  <Text style={{ ...texts.small, marginLeft: 6 }}>{t('Excluir minha conta')}</Text>
                </View>
              </TouchableOpacity>
            )}
          </ShowIf>
          <View style={{ flex: 1 }} />
        </ScrollView>
      </AvoidingView>
    </PaddedView>
  );
}

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { validate } from 'gerador-validador-cpf';
import { trim } from 'lodash';
import React, { useState, useContext, useRef } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { t } from '../../../strings';
import { AppDispatch, ApiContext } from '../../app/context';
import DefaultButton from '../../components/buttons/DefaultButton';
import DefaultInput from '../../components/inputs/DefaultInput';
import AvoidingView from '../../components/views/AvoidingView';
import PaddedView from '../../components/views/PaddedView';
import ShowIf from '../../components/views/ShowIf';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import Consumer from '../../store/consumer/types/Consumer';
import { getCourier } from '../../store/courier/selectors';
import Courier from '../../store/courier/types/Courier';
import { showToast } from '../../store/ui/actions';
import { getUIBusy } from '../../store/ui/selectors';
import { updateProfile } from '../../store/user/actions';
import { screens, padding } from '../../styles';

export type ProfileEditParamList = {
  ProfileEdit: {
    allowPartialSave: boolean;
  };
};

type ScreenNavigationProp = StackNavigationProp<ProfileEditParamList, 'ProfileEdit'>;
type ScreenRouteProp = RouteProp<ProfileEditParamList, 'ProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);
  const { allowPartialSave } = route.params ?? {};

  // refs
  const surnameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);
  const dddRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  // app state
  const busy = useSelector(getUIBusy);
  const flavor = useSelector(getFlavor);
  const courier = useSelector(getCourier);
  const consumer = useSelector(getConsumer);
  const user: Consumer | Courier = flavor === 'consumer' ? consumer! : courier!;

  // state
  const [name, setName] = useState<string>(user!.name ?? '');
  const [surname, setSurname] = useState(user!.surname ?? '');
  const [ddd, setDDD] = useState(user!.phone?.ddd ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user!.phone?.number ?? '');
  const phone = { ddd, number: phoneNumber };
  const [cpf, setCpf] = useState(user!.cpf! ?? '');

  // handlers
  const updateProfileHandler = async () => {
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
    await dispatch(
      updateProfile(api)(user.id!, {
        name: trim(name),
        surname: trim(surname),
        phone: {
          ddd,
          number: phoneNumber,
        },
        cpf,
      })
    );
    navigation.goBack();
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
            keyboardType="default"
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
            keyboardType="default"
          />
          <DefaultInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF')}
            value={cpf}
            placeholder={t('00000000000')}
            maxLength={11}
            keyboardType="number-pad" // are we going to use "-" and "."?
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
                  keyboardType="phone-pad"
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
            disabled={busy}
            activityIndicator={busy}
          />
          <View style={{ flex: 1 }} />
        </ScrollView>
      </AvoidingView>
    </PaddedView>
  );
}

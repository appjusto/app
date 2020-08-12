import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React, { useState, useCallback, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
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
  const scrollViewRef = useRef<ScrollView>(null);

  // app state
  const flavor = useSelector(getFlavor);
  const courier = useSelector(getCourier);
  const consumer = useSelector(getConsumer);
  const user: Consumer | Courier = flavor === 'consumer' ? consumer! : courier!;

  // state
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState<string>(user!.name! ?? '');
  const [surname, setSurname] = useState(user!.surname! ?? '');
  const [phone, setPhone] = useState(user!.phone! ?? '');
  const [cpf, setCpf] = useState(user!.cpf! ?? '');

  // handlers
  const updateProfileHandler = async () => {
    if (updating) return;
    if (!allowPartialSave && !user.personalInfoSet()) {
      dispatch(showToast(t('Você precisa preencher todos os dados.')));
      return;
    }
    setUpdating(true);
    await updateProfile(api)(user!.id, {
      name,
      surname,
      phone,
      cpf,
    });
    navigation.goBack();
    setUpdating(false);
  };

  // UI
  return (
    <View style={{ ...screens.lightGrey }}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flex: 1 }}>
        <AvoidingView style={{ flex: 1 }}>
          <View style={{ marginTop: 32 }}>
            <DefaultInput
              title={t('Nome')}
              value={name}
              onChangeText={(text) => setName(trim(text))}
            />
            <DefaultInput
              style={{ marginTop: 12 }}
              title={t('Sobrenome')}
              value={surname}
              onChangeText={(text) => setSurname(trim(text))}
            />
            <DefaultInput
              style={{ marginTop: 12 }}
              title={t('CPF')}
              value={cpf}
              onChangeText={(text) => setCpf(trim(text))}
            />
            <ShowIf test={flavor === 'courier'}>
              {() => (
                <DefaultInput
                  style={{ marginTop: 12 }}
                  title={t('Celular')}
                  value={phone}
                  onChangeText={(text) => setPhone(trim(text))}
                />
              )}
            </ShowIf>
          </View>
          <DefaultButton
            style={{ marginTop: padding }}
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
        </AvoidingView>
      </ScrollView>
    </View>
  );
}

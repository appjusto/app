import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React, { useState, useCallback, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { erase } from '../../assets/icons';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import Consumer from '../../store/consumer/types/Consumer';
import { getCourier } from '../../store/courier/selectors';
import Courier from '../../store/courier/types/Courier';
import { updateProfile } from '../../store/user/actions';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import AvoidingView from '../common/AvoidingView';
import CheckField from '../common/CheckField';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import ShowIf from '../common/ShowIf';
import { colors, texts, screens, padding } from '../common/styles';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileEdit'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // refs
  const scrollViewRef = useRef<ScrollView>(null);

  // state
  const flavor = useSelector(getFlavor);
  const courier = useSelector(getCourier);
  const consumer = useSelector(getConsumer);
  const user: Consumer | Courier | undefined = flavor === 'consumer' ? consumer : courier;
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState<string>(user!.name! ?? '');
  const [surname, setSurname] = useState(user!.surname! ?? '');
  const [phone, setPhone] = useState(user!.phone! ?? '');
  const [cpf, setCpf] = useState(user!.cpf! ?? '');
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // handlers
  const toggleAcceptMarketing = useCallback(() => {
    setAcceptMarketing(!acceptMarketing);
    scrollViewRef.current?.scrollToEnd();
  }, [acceptMarketing]);

  const updateProfileHandler = async () => {
    if (updating) return;
    setUpdating(true);
    await updateProfile(api)(user!.id, {
      name,
      surname,
      phone,
      cpf,
      acceptMarketing,
    });
    if (!route.params?.nextScreen) {
      navigation.goBack();
    } else {
      navigation.navigate(route.params!.nextScreen!, route.params!.nextScreenParams);
    }
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
            <DefaultInput
              style={{ marginTop: 12 }}
              title={t('Celular')}
              value={phone}
              onChangeText={(text) => setPhone(trim(text))}
            />
          </View>
          <CheckField
            marginTop={padding}
            checked={acceptMarketing}
            onPress={toggleAcceptMarketing}
            text={t('Aceito receber comunicações e ofertas')}
          />
          <DefaultButton
            styleObject={{ marginTop: padding }}
            title={t('Atualizar')}
            onPress={updateProfileHandler}
            activityIndicator={updating}
          />
          <ShowIf test={!route.params?.hideDeleteAccount}>
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

const styles = StyleSheet.create({
  checkContainer: {
    // width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  eraseContainer: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
});

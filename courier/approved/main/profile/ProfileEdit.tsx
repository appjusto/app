import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourierProfile } from 'appjusto-types';
import { trim } from 'lodash';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import { getCourier } from '../../../../common/store/courier/selectors';
import { courierInfoSet } from '../../../../common/store/courier/validators';
import { showToast } from '../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { CourierProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'ProfileEdit'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'ProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // refs
  const surnameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;

  // state
  const [name, setName] = useState<string>(courier.name ?? '');
  const [surname, setSurname] = useState(courier.surname ?? '');
  const [phone, setPhone] = useState(courier.phone ?? '');
  const [cpf, setCpf] = useState(courier.cpf! ?? '');
  const updatedCourier: Partial<CourierProfile> = useMemo(() => ({ name, surname, phone, cpf }), [
    name,
    surname,
    phone,
    cpf,
  ]);
  const canSubmit = useMemo(() => courierInfoSet(updatedCourier), [updatedCourier]);

  // handlers
  const updateProfileHandler = async () => {
    try {
      await dispatch(updateProfile(api)(courier.id, updatedCourier));
      navigation.goBack();
    } catch (error) {
      dispatch(showToast(t('Não foi possível atualizar seu perfil.')));
    }
  };

  // UI
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView>
        <PaddedView>
          <DefaultInput
            title={t('Nome')}
            placeholder={t('Digite seu nome')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => surnameRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
          />
          <DefaultInput
            ref={surnameRef}
            style={{ marginTop: padding }}
            title={t('Sobrenome')}
            placeholder={t('Digite seu sobrenome')}
            value={surname}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setSurname(text)}
            onSubmitEditing={() => cpfRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
          />
          <PatternInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF')}
            value={cpf}
            placeholder={t('Seu CPF, apenas números')}
            mask={cpfMask}
            parser={numbersOnlyParser}
            formatter={cpfFormatter}
            keyboardType="number-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setCpf(trim(text))}
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <PatternInput
            ref={phoneRef}
            style={{ marginTop: padding }}
            title={t('Celular')}
            value={phone}
            placeholder={t('Número do seu celular')}
            mask={phoneMask}
            parser={numbersOnlyParser}
            formatter={phoneFormatter}
            keyboardType="number-pad"
            returnKeyType="done"
            blurOnSubmit
            onChangeText={(text) => setPhone(trim(text))}
          />

          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Atualizar')}
            onPress={updateProfileHandler}
            disabled={!canSubmit || busy}
            activityIndicator={busy}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}

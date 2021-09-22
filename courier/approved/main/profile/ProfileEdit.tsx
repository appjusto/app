import { CourierProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useSegmentScreen } from '../../../../common/store/api/track';
import { getCourier } from '../../../../common/store/courier/selectors';
import { courierInfoSet } from '../../../../common/store/courier/validators';
import { showToast } from '../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
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
  const api = React.useContext(ApiContext);
  // redux
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;
  // state
  const [name, setName] = React.useState<string>(courier.name ?? '');
  const [surname, setSurname] = React.useState(courier.surname ?? '');
  const [phone, setPhone] = React.useState(courier.phone ?? '');
  const [cpf, setCpf] = React.useState(courier.cpf! ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  // helpers
  const updatedCourier: Partial<CourierProfile> = {
    name: name.trim(),
    surname: surname.trim(),
    cpf: cpf.trim(),
    phone: phone.trim(),
  };
  const canSubmit = courierInfoSet(updatedCourier);
  const profileApproved = courier.situation === 'approved';
  // side effects
  // tracking
  useSegmentScreen('Profile Edit');
  // refs
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  // handlers
  const updateProfileHandler = async () => {
    try {
      await dispatch(updateProfile(api)(courier.id, updatedCourier));
      navigation.goBack();
    } catch (error) {
      dispatch(showToast(t('Não foi possível atualizar seu perfil.'), 'error'));
    }
  };
  // UI
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...texts.x2l,
            paddingHorizontal: padding,
            paddingTop: padding,
            paddingBottom: halfPadding,
          }}
        >
          {t('Seus dados')}
        </Text>

        <Text
          style={{
            ...texts.sm,
            paddingHorizontal: padding,
            color: colors.grey700,
            paddingBottom: padding,
          }}
        >
          {t('Edite seus dados pessoais:')}
        </Text>
        <PaddedView style={{ flex: 1 }}>
          <DefaultInput title={t('E-mail')} value={courier.email} editable={false} />
          <DefaultInput
            style={{ marginTop: padding }}
            title={t('Nome')}
            placeholder={t('Digite seu nome')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => surnameRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
            editable={!profileApproved}
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
            onSubmitEditing={() => phoneRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
            editable={!profileApproved}
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
            blurOnSubmit={false}
            onChangeText={(text) => setPhone(trim(text))}
            onSubmitEditing={() => cpfRef.current?.focus()}
            editable={!profileApproved}
          />
          {cpf.length > 0 && !cpfutils.isValid(cpf) && focusedField !== 'cpf' && (
            <Text
              style={{
                ...texts.sm,
                ...texts.bold,
                color: colors.grey700,
                marginTop: padding,
                marginLeft: 6,
              }}
            >
              {t('O CPF digitado não é válido.')}
            </Text>
          )}
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
            blurOnSubmit
            onFocus={() => setFocusedField('cpf')}
            onBlur={() => setFocusedField(undefined)}
            onChangeText={(text) => setCpf(trim(text))}
            editable={!profileApproved}
          />

          <View style={{ flex: 1 }} />
          {!profileApproved && (
            <SafeAreaView>
              <DefaultButton
                title={t('Avançar')}
                onPress={updateProfileHandler}
                disabled={!canSubmit || busy}
                activityIndicator={busy}
              />
            </SafeAreaView>
          )}
        </PaddedView>
      </View>
    </KeyboardAwareScrollView>
  );
}

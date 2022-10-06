import { UserProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { ActivityIndicator, Keyboard, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from '../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../common/components/inputs/PatternInput';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { getManager } from '../../../common/store/business/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessAppContext } from '../../BusinessAppContext';
import { BusinessNavParamsList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'BusinessProfile'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'BusinessProfile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const BusinessProfile = ({ navigation, route }: Props) => {
  // context
  const { business } = React.useContext(BusinessAppContext);
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // redux
  const manager = useSelector(getManager);
  // state
  const [name, setName] = React.useState<string>(manager?.name ?? '');
  const [surname, setSurname] = React.useState(manager?.surname ?? '');
  const [cpf, setCpf] = React.useState(manager?.cpf ?? '');
  const [phone, setPhone] = React.useState(manager?.phone ?? api.auth().getPhoneNumber(true) ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);
  // tracking
  useSegmentScreen('BusinessOptions');
  const countryCode = manager?.countryCode ?? '55';
  const updatedUser: Partial<UserProfile> = {
    name: name.trim(),
    surname: surname.trim(),
    cpf: cpf.trim(),
    phone: phone.trim(),
    countryCode,
  };
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  // handler
  const updateManagerProfileHandler = async () => {
    Keyboard.dismiss();
    if (!manager) return;
    try {
      setLoading(true);
      await api.profile().updateProfile(manager.id, updatedUser);
      track('manager profile updated');
      setLoading(false);
      dispatch(showToast(t('Dados alterados com sucesso.'), 'success'));
      navigation.goBack();
    } catch (error) {
      console.error(error);
      dispatch(
        showToast(t('Não foi possível atualizar o perfil. Tente novamente mais tarde.'), 'error')
      );
    }
  };
  //UI
  if (business === undefined || manager === undefined) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
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
      <PaddedView style={{ flex: 1 }}>
        <Text style={{ ...texts.x2l, paddingBottom: padding }}>{t('Dados do restaurante:')}</Text>
        <View>
          <DefaultInput
            title={t('Nome do restaurante')}
            editable={false}
            value={business.name}
            style={{ flexWrap: 'wrap' }}
          />
          <DefaultInput
            title={t('E-mail')}
            style={{ marginTop: padding, flexWrap: 'wrap' }}
            editable={false}
            value={manager.email}
          />
          <DefaultInput
            ref={nameRef}
            title={t('Nome')}
            style={{ marginTop: padding, flexWrap: 'wrap' }}
            placeholder={t('Digite seu nome')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => surnameRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
            editable
          />
          <DefaultInput
            ref={surnameRef}
            title={t('Sobrenome')}
            style={{ marginTop: padding, flexWrap: 'wrap' }}
            placeholder={t('Digite seu sobrenome')}
            value={surname}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setSurname(text)}
            onSubmitEditing={() => cpfRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
            editable
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
            returnKeyType="default"
            onSubmitEditing={() => phoneRef.current?.focus()}
            onChangeText={(text) => setCpf(trim(text))}
            onFocus={() => setFocusedField('cpf')}
            blurOnSubmit
            onBlur={() => setFocusedField(undefined)}
            editable
          />
          {cpf.length > 0 && !cpfutils.isValid(cpf) && focusedField !== 'cpf' ? (
            <Text
              style={{
                ...texts.sm,
                ...texts.bold,
                color: colors.red,
                marginTop: padding,
                marginLeft: 6,
              }}
            >
              {t('O CPF digitado não é válido.')}
            </Text>
          ) : null}
          <PatternInput
            ref={phoneRef}
            style={{ marginTop: padding }}
            title={t('Celular')}
            value={phone}
            placeholder={t('Número com DDD')}
            mask={phoneMask}
            parser={numbersOnlyParser}
            formatter={phoneFormatter}
            keyboardType="number-pad"
            returnKeyType="next"
            onChangeText={(text) => setPhone(trim(text))}
            editable
            blurOnSubmit
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <DefaultButton
            title={t('Alterar dados')}
            onPress={updateManagerProfileHandler}
            disabled={isLoading}
            activityIndicator={isLoading}
            style={{ marginTop: padding }}
          />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};

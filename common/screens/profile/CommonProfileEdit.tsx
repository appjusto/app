import { Dayjs } from '@appjusto/dates';
import { UserProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty, trim } from 'lodash';
import React from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { RestaurantNavigatorParamList } from '../../../consumer/v2/food/restaurant/types';
import { ProfileParamList } from '../../../consumer/v2/main/profile/types';
import { P2POrderNavigatorParamList } from '../../../consumer/v2/p2p/types';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { CourierProfileParamList } from '../../../courier/approved/main/profile/types';
import { ApprovedParamList } from '../../../courier/approved/types';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../app/context';
import DefaultButton from '../../components/buttons/DefaultButton';
import PaddedView from '../../components/containers/PaddedView';
import DefaultInput from '../../components/inputs/DefaultInput';
import {
  birthdayFormatter,
  birthdayMask,
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from '../../components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../components/inputs/pattern-input/parsers';
import PatternInput from '../../components/inputs/PatternInput';
import { useProfileSummary } from '../../store/api/profile/useProfileSummary';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { isConsumerProfileComplete } from '../../store/consumer/validators';
import { getCourier } from '../../store/courier/selectors';
import { courierInfoSet } from '../../store/courier/validators';
import { showToast } from '../../store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../styles';

export type ProfileEditParamList = {
  CommonProfileEdit?: {
    returnScreen?: 'FoodOrderCheckout' | 'CreateOrderP2P' | 'ProfileAddCard';
    returnNextScreen?: 'FoodOrderCheckout' | 'CreateOrderP2P';
  };
};

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    ProfileParamList &
      P2POrderNavigatorParamList &
      RestaurantNavigatorParamList &
      CourierProfileParamList,
    'CommonProfileEdit'
  >,
  StackNavigationProp<LoggedNavigatorParamList & ApprovedParamList & UnapprovedParamList>
>;
type ScreenRouteProp = RouteProp<ProfileEditParamList, 'CommonProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const CommonProfileEdit = ({ route, navigation }: Props) => {
  // params
  const { returnScreen, returnNextScreen } = route.params ?? {};
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // refs
  const emailRef = React.useRef<TextInput>(null);
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const birthdayRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  // redux
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const profile = flavor === 'consumer' ? consumer! : courier!;
  // state
  const {
    isProfileComplete,
    canUpdateProfile,
    isProfilePhoneVerified,
    shouldVerifyPhone,
    hasOrdered,
  } = useProfileSummary();
  const [email, setEmail] = React.useState<string>(api.auth().getEmail() ?? profile.email ?? '');
  const [name, setName] = React.useState<string>(profile.name ?? '');
  const [surname, setSurname] = React.useState(profile.surname ?? '');
  const [cpf, setCpf] = React.useState(profile.cpf ?? '');
  const [phone, setPhone] = React.useState(profile.phone ?? api.auth().getPhoneNumber(true) ?? '');
  const [birthday, setBirthday] = React.useState(profile.birthday ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);
  const countryCode = profile.countryCode ?? '55';
  const updatedUser: Partial<UserProfile> = {
    email: email.trim(),
    name: name.trim(),
    surname: surname.trim(),
    cpf: cpf.trim(),
    phone: phone.trim(),
    birthday: birthday.trim(),
    countryCode,
  };
  const birthdayError = (() => {
    if (isEmpty(birthday)) return 'Preencha sua data de nascimento';
    if (birthday.length !== 8) return 'Data inválida';
    const b = `${birthday.slice(0, 2)}/${birthday.slice(2, 4)}/${birthday.slice(4)}`;
    const d = Dayjs(b, 'DD/MM/YYYY');
    if (!d.isValid()) return 'Data inválida';
    const diff = Dayjs(new Date()).diff(d, 'y');
    if (diff < 18) return 'Você precisa ter pelo menos 18 anos.';
    if (diff > 70) return 'Data inválida';
    return null;
  })();
  // side effects
  // tracking
  useSegmentScreen('CommonProfileEdit');
  // helpers
  const canSubmit =
    flavor === 'consumer' ? isConsumerProfileComplete(updatedUser) : courierInfoSet(updatedUser);
  // handlers
  const updateProfileHandler = async () => {
    Keyboard.dismiss();
    try {
      if (!canUpdateProfile) {
        if (shouldVerifyPhone)
          navigation.replace('PhoneVerificationScreen', { phone, countryCode });
        else navigation.replace('RequestProfileEdit');
      } else {
        setLoading(true);
        await api.profile().updateProfile(profile.id, updatedUser);
        track('profile updated');
        setLoading(false);
        if (!isProfilePhoneVerified) {
          navigation.navigate('PhoneVerificationScreen', {
            phone: updatedUser.phone!,
            countryCode,
            returnScreen,
            returnNextScreen,
          });
        } else if (returnScreen) {
          navigation.navigate(returnScreen, { returnScreen: returnNextScreen });
        } else navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      dispatch(
        showToast(t('Não foi possível atualizar o perfil. Tente novamente mais tarde.'), 'error')
      );
    }
  };
  // UI
  const buttonTitle = (() => {
    if (flavor === 'consumer') {
      if (isProfileComplete) {
        if (shouldVerifyPhone && !isProfilePhoneVerified) return t('Verificar telefone');
        else if (!hasOrdered) return t('Atualizar');
        else return t('Atualizar dados');
      } else return t('Salvar');
    } else {
      if (isProfileComplete) {
        return t('Atualizar dados');
      } else return t('Salvar e avançar');
    }
  })();
  const title = (() => {
    if (isProfileComplete) return t('Seus dados:');
    else return t('Finalize seu cadastro:');
  })();
  const subtitle = (() => {
    if (flavor === 'consumer') {
      if (!isProfileComplete) return t('Edite seus dados:');
      else
        return t(
          'Seus dados pessoais serão usados somente para a criação das faturas e receber atendimento quando for necessário.'
        );
    } else {
      return undefined;
    }
  })();
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
        <Text
          style={{
            ...texts.x2l,
            paddingBottom: halfPadding,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              ...texts.sm,
              color: colors.grey700,
              paddingBottom: halfPadding,
            }}
          >
            {subtitle}
          </Text>
        ) : null}

        <DefaultInput
          ref={emailRef}
          style={{ marginTop: halfPadding }}
          title={t('E-mail')}
          placeholder={t('Digite seu e-mail')}
          value={email}
          editable={canUpdateProfile && !api.auth().getEmail()}
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => nameRef.current?.focus()}
        />
        <DefaultInput
          ref={nameRef}
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
          editable={canUpdateProfile}
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
          editable={canUpdateProfile}
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
          onSubmitEditing={() => birthdayRef.current?.focus()}
          onChangeText={(text) => setCpf(trim(text))}
          onFocus={() => setFocusedField('cpf')}
          blurOnSubmit={canSubmit && isProfilePhoneVerified}
          onBlur={() => setFocusedField(undefined)}
          editable={canUpdateProfile}
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
        {flavor === 'courier' ? (
          <View>
            <PatternInput
              ref={birthdayRef}
              style={{ marginTop: padding }}
              title={t('Data de nascimento')}
              value={birthday}
              placeholder={t('Apenas números')}
              mask={birthdayMask}
              parser={numbersOnlyParser}
              formatter={birthdayFormatter}
              keyboardType="number-pad"
              returnKeyType="next"
              onChangeText={(text) => setBirthday(trim(text))}
              onSubmitEditing={() => phoneRef.current?.focus()}
              onFocus={() => setFocusedField('birthday')}
              onBlur={() => setFocusedField(undefined)}
              editable={canUpdateProfile || isEmpty(profile.birthday)}
            />
            {focusedField !== 'birthday' && birthdayError ? (
              <Text
                style={{
                  ...texts.sm,
                  ...texts.bold,
                  color: colors.red,
                  marginTop: padding,
                  marginLeft: 6,
                }}
              >
                {birthdayError}
              </Text>
            ) : null}
          </View>
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
          blurOnSubmit
          onChangeText={(text) => setPhone(trim(text))}
          editable={canUpdateProfile && !api.auth().getPhoneNumber()}
        />

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <DefaultButton
            title={buttonTitle}
            onPress={updateProfileHandler}
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
            style={{ marginTop: padding }}
          />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};

import { ConsumerProfile, CourierProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
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
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from '../../components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../components/inputs/pattern-input/parsers';
import PatternInput from '../../components/inputs/PatternInput';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { consumerInfoSet } from '../../store/consumer/validators';
import { getCourier } from '../../store/courier/selectors';
import { courierInfoSet } from '../../store/courier/validators';
import { colors, halfPadding, padding, screens, texts } from '../../styles';

export type ProfileEditParamList = {
  CommonProfileEdit: undefined;
};

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    ProfileParamList &
      P2POrderNavigatorParamList &
      RestaurantNavigatorParamList &
      CourierProfileParamList,
    'CommonProfileEdit'
  >,
  StackNavigationProp<ApprovedParamList & UnapprovedParamList & LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<ProfileEditParamList, 'CommonProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const CommonProfileEdit = ({ route }: Props) => {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // app state
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const profile = flavor === 'consumer' ? consumer! : courier!;
  // state
  const [name, setName] = React.useState<string>(profile.name ?? '');
  const [surname, setSurname] = React.useState(profile.surname ?? '');
  const [cpf, setCpf] = React.useState(profile.cpf! ?? '');
  const [phone, setPhone] = React.useState(profile.phone! ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);
  // helpers
  const updatedUser: Partial<CourierProfile> | Partial<ConsumerProfile> = {
    name: name.trim(),
    surname: surname.trim(),
    cpf: cpf.trim(),
    phone: phone.trim(),
  };
  const canSubmit =
    flavor === 'consumer' ? consumerInfoSet(updatedUser) : courierInfoSet(updatedUser); // fix typescript complaint
  // consumer
  // const isProfileComplete = isConsumerProfileComplete(consumer);
  // const options = React.useMemo(() => ({ consumerId: consumer.id }), [consumer.id]);
  // const orders = useObserveOrders(options);

  // courier
  // const canSubmit = courierInfoSet(updatedCourier);
  // const profileApproved = courier.situation === 'approved';
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
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
      <PaddedView>
        {/* TODO: this string should be dynamic and work for all cases */}
        <Text
          style={{
            ...texts.x2l,
            paddingBottom: halfPadding,
          }}
        >
          {t('Seus dados')}
        </Text>
        {/* TODO: this string should be dynamic and work for all cases */}
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            paddingBottom: padding,
          }}
        >
          {t('Edite seus dados pessoais:')}
        </Text>
        <DefaultInput title={t('E-mail')} value={profile.email} editable={false} />
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
          // editable={!orders}
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
          // editable={!orders}
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
          blurOnSubmit={false}
          onSubmitEditing={() => phoneRef.current?.focus()}
          onChangeText={(text) => setCpf(trim(text))}
          onFocus={() => setFocusedField('cpf')}
          onBlur={() => setFocusedField(undefined)}
          // editable={!orders}
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
          ref={phoneRef}
          style={{ marginTop: padding }}
          title={t('Celular')}
          value={phone}
          placeholder={t('Número do seu celular')}
          mask={phoneMask}
          parser={numbersOnlyParser}
          formatter={phoneFormatter}
          keyboardType="number-pad"
          returnKeyType="next"
          blurOnSubmit
          onChangeText={(text) => setPhone(trim(text))}
          // editable={!orders}
        />
        <View style={{ flex: 1 }} />
        <View style={{ paddingVertical: padding }}>
          <DefaultButton
            title={t('Escolha um título')}
            onPress={() => null}
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
          />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};

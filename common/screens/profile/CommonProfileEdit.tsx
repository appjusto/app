import { ConsumerProfile, CourierProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
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
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from '../../components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../components/inputs/pattern-input/parsers';
import PatternInput from '../../components/inputs/PatternInput';
import { useObserveOrders } from '../../store/api/order/hooks/useObserveOrders';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { consumerInfoSet } from '../../store/consumer/validators';
import { getCourier } from '../../store/courier/selectors';
import { courierInfoSet, isConsumerProfileComplete } from '../../store/courier/validators';
import { showToast } from '../../store/ui/actions';
import { updateProfile } from '../../store/user/actions';
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
  // app state
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer)!;
  const courier = useSelector(getCourier)!;
  const profile = flavor === 'consumer' ? consumer : courier;
  // state
  const [name, setName] = React.useState<string>(profile.name ?? '');
  const [surname, setSurname] = React.useState(profile.surname ?? '');
  const [cpf, setCpf] = React.useState(profile.cpf! ?? '');
  const [phone, setPhone] = React.useState(profile.phone! ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);
  const options = React.useMemo(() => ({ consumerId: consumer.id }), [consumer.id]);
  const orders = useObserveOrders(options);

  // tracking
  useSegmentScreen('CommonProfileEdit');

  // refs
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);

  // helpers
  const updatedUser = {
    name: name.trim(),
    surname: surname.trim(),
    cpf: cpf.trim(),
    phone: phone.trim(),
  };
  const canSubmit =
    flavor === 'consumer'
      ? consumerInfoSet(updatedUser as Partial<ConsumerProfile> | undefined)
      : courierInfoSet(updatedUser as Partial<CourierProfile> | undefined);
  const isProfileApproved =
    flavor === 'consumer' ? isConsumerProfileComplete(consumer) : courier.situation === 'approved';
  const hasOrdered = orders.filter((order) => order.status === 'delivered').length > 0;
  const buttonTitle = (() => {
    if (flavor === 'consumer') {
      if (isProfileApproved) {
        if (!hasOrdered) return t('Atualizar');
        else return t('Atualizar dados');
      } else return t('Salvar e avançar');
    } else {
      if (isProfileApproved) {
        return t('Atualizar dados');
      } else return t('Salvar e avançar');
    }
  })();
  const title = (() => {
    if (isProfileApproved) return t('Seus dados:');
    else return t('Finalize seu cadastro');
  })();
  const subtitle = (() => {
    if (flavor === 'consumer') {
      if (!isProfileApproved) return t('Edite seus dados:');
      else
        return t(
          'Seus dados pessoais serão usados somente para a criação das faturas e receber atendimento quando for necessário.'
        );
    } else {
      return undefined;
    }
  })();
  const editable = flavor === 'consumer' ? !hasOrdered : !isProfileApproved;

  // handler
  const updateProfileHandler = async () => {
    Keyboard.dismiss();
    try {
      if (flavor === 'consumer') {
        if (hasOrdered) {
          track('navigating to RequestProfileEdit');
          navigation.replace('RequestProfileEdit');
        } else {
          setLoading(true);
          api.profile().updateProfile(consumer.id, updatedUser);
          track('profile updated');
          setLoading(false);
          if (returnScreen) navigation.navigate(returnScreen, { returnScreen: returnNextScreen });
          else navigation.goBack();
        }
      } else if (flavor === 'courier') {
        if (isProfileApproved) {
          track('navigating to RequestProfileEdit');
          navigation.replace('RequestProfileEdit');
        } else {
          setLoading(true);
          await dispatch(updateProfile(api)(courier.id, updatedUser));
          track('profile updated');
          setLoading(false);
          navigation.goBack();
        }
      }
    } catch (error) {
      dispatch(
        showToast(t('Não foi possível atualizar o perfil. Tente novamente mais tarde.'), 'error')
      );
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
      <PaddedView style={{ flex: 1 }}>
        <Text
          style={{
            ...texts.x2l,
            paddingBottom: halfPadding,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            paddingBottom: padding,
          }}
        >
          {subtitle}
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
          editable={editable}
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
          editable={editable}
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
          editable={editable}
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
          editable={editable}
        />
        <View style={{ flex: 1 }} />
        <View style={{ paddingVertical: padding }}>
          <DefaultButton
            title={buttonTitle}
            onPress={updateProfileHandler}
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
          />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};

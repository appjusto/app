import { ConsumerProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
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
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { consumerInfoSet } from '../../../../common/store/consumer/validators';
import { isConsumerProfileComplete } from '../../../../common/store/courier/validators';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import { ProfileParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProfileParamList, 'ProfileEdit'>,
  StackNavigationProp<P2POrderNavigatorParamList & RestaurantNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { returnScreen, returnNextScreen } = route.params ?? {};
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // app state
  const consumer = useSelector(getConsumer)!;
  const isProfileComplete = isConsumerProfileComplete(consumer);
  // state
  const [name, setName] = React.useState<string>(consumer.name ?? '');
  const [surname, setSurname] = React.useState(consumer.surname ?? '');
  const [cpf, setCpf] = React.useState(consumer.cpf! ?? '');
  const [phone, setPhone] = React.useState(consumer.phone! ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);
  const updatedConsumer: Partial<ConsumerProfile> = {
    name: name.trim(),
    surname: surname.trim(),
    cpf: cpf.trim(),
    phone: phone.trim(),
  };
  const canSubmit = consumerInfoSet(updatedConsumer);
  // handlers
  const updateProfileHandler = async () => {
    try {
      setLoading(true);
      api.profile().updateProfile(consumer.id, updatedConsumer);
      setLoading(false);
      if (returnScreen) navigation.navigate(returnScreen, { returnScreen: returnNextScreen });
      else navigation.goBack();
    } catch (error) {
      dispatch(showToast(t('Não foi possível atualizar o perfil.'), 'error'));
    }
  };
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);

  // UI
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        style={{ flex: 1 }}
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
            {isProfileComplete ? t('Seus dados') : t('Finalize seu cadastro')}
          </Text>
          <Text
            style={{
              ...texts.sm,
              color: colors.grey700,
              paddingBottom: padding,
            }}
          >
            {isProfileComplete
              ? t('Edite seus dados pessoais:')
              : t(
                  'Seus dados pessoais serão usados somente para a criação das faturas e receber atendimento quando for necessário.'
                )}
          </Text>
          <DefaultInput title={t('E-mail')} value={consumer.email} editable={false} />
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
            returnKeyType="default"
            blurOnSubmit={false}
            onSubmitEditing={() => phoneRef.current?.focus()}
            onChangeText={(text) => setCpf(trim(text))}
            onFocus={() => setFocusedField('cpf')}
            onBlur={() => setFocusedField(undefined)}
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
          />
          <View style={{ flex: 1 }} />
          <View style={{ paddingVertical: padding }}>
            <DefaultButton
              title={isProfileComplete ? t('Atualizar') : t('Salvar e avançar')}
              onPress={updateProfileHandler}
              disabled={!canSubmit || isLoading}
              activityIndicator={isLoading}
            />
          </View>
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}

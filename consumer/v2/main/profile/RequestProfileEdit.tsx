import * as cpfutils from '@fnando/cpf';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
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
import FeedbackView from '../../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../../common/icons/icon-motocycle';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'RequestProfileEdit'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'RequestProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RequestProfileEdit = ({ navigation, route }: Props) => {
  // app state
  const consumer = useSelector(getConsumer)!;
  // state
  const [name, setName] = React.useState<string>(consumer.name ?? '');
  const [surname, setSurname] = React.useState(consumer.surname ?? '');
  const [cpf, setCpf] = React.useState(consumer.cpf! ?? '');
  const [phone, setPhone] = React.useState(consumer.phone! ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  const [requestSent, setRequestSent] = React.useState(false);
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  //TODO: rememeber Keyboard.dismiss() in the handler
  //UI
  if (!consumer) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  if (requestSent) {
    return (
      <FeedbackView
        header={t('Solicitação enviada!')}
        description={t('Aguarde enquanto realizamos as alterações solicitadas')}
        icon={<IconMotocycle />}
        background={colors.grey50}
      />
    );
  }
  return (
    <KeyboardAwareScrollView
      style={{ ...screens.config }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
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
          {t('Seus dados')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            paddingBottom: padding,
          }}
        >
          {t('Edite seus dados pessoais:')}
        </Text>
        <DefaultInput
          ref={nameRef}
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
        <DefaultButton title={t('Atualizar dados')} />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};

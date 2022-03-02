import { UserProfile } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import * as cpfutils from '@fnando/cpf';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { ActivityIndicator, Keyboard, Text, TextInput, View } from 'react-native';
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
import FeedbackView from '../../../../common/components/views/FeedbackView';
import { useRequestedProfileChanges } from '../../../../common/hooks/useRequestedProfileChanges';
import { IconMotocycle } from '../../../../common/icons/icon-motocycle';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { getFlavor } from '../../../../common/store/config/selectors';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { getCourier } from '../../../../common/store/courier/selectors';
import { showToast } from '../../../../common/store/ui/actions';
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
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // app state
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const user = flavor === 'consumer' ? consumer! : courier!;
  // state
  const [name, setName] = React.useState<string>('');
  const [surname, setSurname] = React.useState<string>('');
  const [cpf, setCpf] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [requestSent, setRequestSent] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const requestedChanges = useRequestedProfileChanges(user.id);
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  //tracking
  useSegmentScreen('RequestProfileEdit');
  // helpers
  const canEdit = requestedChanges.length === 0;
  const disabledButton = !name && !surname && !cpf && !phone;
  const description = (() => {
    if (flavor === 'consumer') {
      return t(
        'Por motivos de segurança, depois que o cliente realiza o primeiro pedido, a alteração de dados pessoais somente é realizada após análise da nossa equipe.'
      );
    } else
      return t(
        'Por motivos de segurança, alterações nos dados de entregadores já aprovados somente podem ser realizadas após análise da nossa equipe.'
      );
  })();
  const userData = user.name && user.surname && user.cpf && user.phone;
  const userChanges: Partial<UserProfile> = {};
  // handlers
  const changeProfileHandler = async () => {
    Keyboard.dismiss();
    try {
      if (name) userChanges.name = name;
      if (surname) userChanges.surname = surname;
      if (cpf) {
        if (cpf.length > 0 && cpfutils.isValid(cpf)) userChanges.cpf = cpf;
        else return;
      }
      if (phone) userChanges.phone = phone;
      setLoading(true);
      await api.user().requestProfileChange(user.id, userChanges);
      track('profile edit requested');
      setLoading(false);
      setRequestSent(true);
    } catch (error: any) {
      dispatch(
        showToast(
          t('Não foi realizar a operação nesse momento. Tente novamente mais tarde'),
          'error'
        )
      );
    }
  };
  //UI
  if (requestedChanges === undefined || !userData) {
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
    <View style={{ ...screens.config }}>
      <KeyboardAwareScrollView
        style={{ ...screens.config }}
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <View style={{ flex: 1 }}>
          {canEdit ? (
            <View style={{ paddingHorizontal: padding, paddingTop: padding }}>
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
            </View>
          ) : (
            <PaddedView style={{ marginBottom: padding }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}
              >
                <Feather name="info" size={14} />
                <Text style={{ ...texts.md, marginLeft: halfPadding, color: colors.red }}>
                  {t('Alteração em análise')}
                </Text>
              </View>
              <Text style={{ ...texts.xs }}>
                {t(
                  'Você já possui uma solicitação de alteração de dados em andamento. Aguarde enquanto analisamos a requisição para realizar uma nova.'
                )}
              </Text>
            </PaddedView>
          )}
          <View style={{ flex: 1, paddingHorizontal: padding }}>
            <DefaultInput
              ref={nameRef}
              title={t('Nome')}
              placeholder={user.name}
              value={name}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setName(text)}
              onSubmitEditing={() => surnameRef.current?.focus()}
              keyboardType="default"
              maxLength={30}
              editable={canEdit}
            />
            <DefaultInput
              ref={surnameRef}
              style={{ marginTop: padding }}
              title={t('Sobrenome')}
              placeholder={user.surname}
              value={surname}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setSurname(text)}
              onSubmitEditing={() => cpfRef.current?.focus()}
              keyboardType="default"
              maxLength={30}
              editable={canEdit}
            />
            <PatternInput
              ref={cpfRef}
              style={{ marginTop: padding }}
              title={t('CPF')}
              value={cpf}
              placeholder={cpfFormatter(user.cpf)}
              mask={cpfMask}
              parser={numbersOnlyParser}
              formatter={cpfFormatter}
              keyboardType="number-pad"
              returnKeyType="default"
              blurOnSubmit={false}
              onSubmitEditing={() => phoneRef.current?.focus()}
              onChangeText={(text) => setCpf(trim(text))}
              editable={canEdit}
            />
            {cpf.length > 0 && !cpfutils.isValid(cpf) ? (
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
              placeholder={phoneFormatter(user.phone)}
              mask={phoneMask}
              parser={numbersOnlyParser}
              formatter={phoneFormatter}
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit
              onChangeText={(text) => setPhone(trim(text))}
              editable={canEdit}
            />
          </View>
        </View>
        {canEdit ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }} />
            <PaddedView style={{ flex: 1, backgroundColor: colors.white }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: padding }}>
                <Feather name="info" size={14} />
                <Text style={{ ...texts.md, marginLeft: halfPadding }}>
                  {t('Informações sobre a alteração de dados')}
                </Text>
              </View>
              <Text style={{ ...texts.xs, marginBottom: padding }}>{description}</Text>
              <View style={{ flex: 1 }} />
              <DefaultButton
                title={t('Solicitar alteração')}
                onPress={changeProfileHandler}
                disabled={!canEdit || disabledButton}
              />
            </PaddedView>
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    </View>
  );
};

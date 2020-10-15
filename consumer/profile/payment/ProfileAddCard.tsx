import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { validate } from 'gerador-validador-cpf';
import { isEmpty, toNumber, trim } from 'lodash';
import React, { useState, useRef, useContext, useMemo } from 'react';
import { View, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import useAxiosCancelToken from '../../../common/hooks/useAxiosCancelToken';
import { saveCard } from '../../../common/store/consumer/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { screens, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { ProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileAddCard'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileAddCard'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { returnScreen } = route.params ?? {};
  const createCancelToken = useAxiosCancelToken();

  // refs
  const expirationMonthRef = useRef<TextInput>(null);
  const expirationYearRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);
  const surnameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);

  // app state
  const busy = useSelector(getUIBusy);

  // state
  const [number, setNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCVV] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cpf, setCPF] = useState('');
  const canSubmit = useMemo(() => {
    return (
      !isEmpty(number) &&
      !isEmpty(month) &&
      !isEmpty(year) &&
      !isEmpty(cvv) &&
      !isEmpty(name) &&
      !isEmpty(surname) &&
      validate(cpf)
    );
  }, [number, month, year, cvv, name, surname, cpf]);

  // handlers
  const saveCardHandler = async () => {
    try {
      const result = await dispatch(
        saveCard(api)(
          cpf,
          {
            number,
            month,
            year,
            verification_value: cvv,
            first_name: trim(name),
            last_name: trim(surname),
          },
          createCancelToken()
        )
      );
      if (returnScreen)
        navigation.navigate(returnScreen, { paymentMethodId: result.paymentMethodId });
      else navigation.pop();
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
  };

  // UI
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView>
        <PaddedView>
          <DefaultInput
            style={{ flex: 1 }}
            title={t('Número do cartão')}
            value={number}
            placeholder={t('0000000000000000')}
            maxLength={19}
            keyboardType="number-pad"
            textContentType="creditCardNumber"
            autoCompleteType="cc-number"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => {
              if (!isNaN(toNumber(text))) setNumber(text);
            }}
            onSubmitEditing={() => expirationMonthRef.current?.focus()}
          />
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              ref={expirationMonthRef}
              style={{ flex: 2, marginRight: padding }}
              title={t('Mês de validade')}
              value={month}
              placeholder={t('00')}
              maxLength={2}
              keyboardType="number-pad"
              returnKeyType="next"
              autoCompleteType="cc-exp-month"
              blurOnSubmit={false}
              onChangeText={(text) => {
                if (!isNaN(toNumber(text))) setMonth(text);
              }}
              onSubmitEditing={() => expirationYearRef.current?.focus()}
            />
            <DefaultInput
              ref={expirationYearRef}
              style={{ flex: 2, marginRight: padding }}
              title={t('Ano de validade')}
              value={year}
              placeholder={t('0000')}
              maxLength={4}
              keyboardType="number-pad"
              returnKeyType="next"
              autoCompleteType="cc-exp-year"
              blurOnSubmit={false}
              onChangeText={(text) => {
                if (!isNaN(toNumber(text))) setYear(text);
              }}
              onSubmitEditing={() => cvvRef.current?.focus()}
            />
            <DefaultInput
              ref={cvvRef}
              style={{ flex: 1 }}
              title={t('CVV')}
              value={cvv}
              placeholder={t('000')}
              maxLength={4}
              keyboardType="number-pad"
              returnKeyType="next"
              autoCompleteType="cc-csc"
              blurOnSubmit={false}
              onChangeText={(text) => {
                if (!isNaN(toNumber(text))) setCVV(text);
              }}
              onSubmitEditing={() => nameRef.current?.focus()}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              ref={nameRef}
              style={{ flex: 1, marginRight: padding }}
              title={t('Nome ')}
              value={name}
              placeholder={t('Conforme cartão')}
              keyboardType="name-phone-pad"
              returnKeyType="next"
              textContentType="givenName"
              autoCompleteType="name"
              autoCapitalize="characters"
              blurOnSubmit={false}
              onChangeText={setName}
              onSubmitEditing={() => surnameRef.current?.focus()}
            />
            <DefaultInput
              ref={surnameRef}
              style={{ flex: 1 }}
              title={t('Sobrenome')}
              value={surname}
              placeholder={t('Conforme cartão')}
              keyboardType="name-phone-pad"
              textContentType="familyName"
              autoCompleteType="name"
              autoCapitalize="characters"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={setSurname}
              onSubmitEditing={() => cpfRef.current?.focus()}
            />
          </View>
          <DefaultInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF do titular')}
            value={cpf}
            placeholder={t('00000000000')}
            maxLength={11}
            keyboardType="number-pad"
            returnKeyType="done"
            blurOnSubmit
            onChangeText={(text) => {
              if (!isNaN(toNumber(text))) setCPF(text);
            }}
          />
          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Salvar')}
            onPress={saveCardHandler}
            disabled={!canSubmit || busy}
            activityIndicator={busy}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}

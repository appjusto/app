import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { validate } from 'gerador-validador-cpf';
import { isEmpty, toNumber, trim } from 'lodash';
import React from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import {
  cardFormatter,
  cardMask,
  cpfFormatter,
  cpfMask,
} from '../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../common/components/inputs/PatternInput';
import useAxiosCancelToken from '../../../common/hooks/useAxiosCancelToken';
import { showToast } from '../../../common/store/ui/actions';
import { padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileAddCard'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileAddCard'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { returnScreen } = route.params ?? {};
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // refs
  const expirationMonthRef = React.useRef<TextInput>(null);
  const expirationYearRef = React.useRef<TextInput>(null);
  const cvvRef = React.useRef<TextInput>(null);
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
  // state
  const [number, setNumber] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [cvv, setCVV] = React.useState('');
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [cpf, setCPF] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const canSubmit = React.useMemo(() => {
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
  // UI handlers
  const createCancelToken = useAxiosCancelToken();
  const saveCardHandler = async () => {
    try {
      setLoading(true);
      const result = await api.consumer().saveCard(
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
      );
      setLoading(false);
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
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <PaddedView>
          <PatternInput
            style={{ flex: 1 }}
            title={t('Número do cartão')}
            value={number}
            placeholder={t('0000 0000 0000 0000')}
            mask={cardMask}
            parser={numbersOnlyParser}
            formatter={cardFormatter}
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
              maxLength={3}
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
          <PatternInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF do titular')}
            value={cpf}
            placeholder={t('Seu CPF, apenas números')}
            mask={cpfMask}
            parser={numbersOnlyParser}
            formatter={cpfFormatter}
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
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}

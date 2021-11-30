import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty, toNumber, trim } from 'lodash';
import React, { useCallback } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import {
  cardFormatter,
  cardMask
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import useAxiosCancelToken from '../../../../common/hooks/useAxiosCancelToken';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { CreditCardType } from '../../../../common/utils/credit-card/CreditCard';
import {
  getCreditCard,
  isAllowed
} from '../../../../common/utils/credit-card/CreditCardImplementation';
import { t } from '../../../../strings';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { OngoingOrderNavigatorParamList } from '../../ongoing/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import { ProfileParamList } from './types';

export type ProfileAddCardParamList = {
  ProfileAddCard?: {
    returnScreen?: 'FoodOrderCheckout' | 'CreateOrderP2P' | 'OngoingOrderDeclined';
  };
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList &
  RestaurantNavigatorParamList &
  P2POrderNavigatorParamList &
  OngoingOrderNavigatorParamList,
  'ProfileAddCard'
>;
type ScreenRouteProp = RouteProp<ProfileAddCardParamList, 'ProfileAddCard'>;

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
  // state
  const [number, setNumber] = React.useState('');
  const [numberError, setNumberError] = React.useState('');
  const [yearError, setYearError] = React.useState('');
  const [monthError, setMonthError] = React.useState('');
  const [CreditCardIcon, setCreditCardIcon] = React.useState<React.ReactNode | undefined>();
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [cvv, setCVV] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const canSubmit =
    !isEmpty(number) && !isEmpty(month) && !isEmpty(year) && !isEmpty(cvv) && !isEmpty(fullName);
  // tracking
  useSegmentScreen('ProfileAddCard');
  // UI handlers
  const createCancelToken = useAxiosCancelToken();
  const saveCardHandler = async () => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      const firstName = trim(fullName.split(' ', 1).toString());
      const lastName = trim(fullName.split(' ').splice(1).join(' '));
      const result = await api.consumer().saveCard(
        {
          number,
          month,
          year,
          verification_value: cvv,
          first_name: firstName,
          last_name: lastName,
        },
        createCancelToken()
      );
      setLoading(false);
      if (returnScreen) {
        navigation.navigate(returnScreen, { paymentMethodId: result.paymentMethodId });
      } else navigation.pop();
    } catch (error: any) {
      setLoading(false);
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  const onChangeNumber = useCallback(
    (text: string) => {
      if (isNaN(toNumber(text))) return;

      setNumber(text);

      const { label, type, icon: creditCardIcon } = getCreditCard(text);

      if (!isAllowed(type) && type !== CreditCardType.undefined) {
        setNumberError(`Não aceitamos a bandeira ${label}`);
      } else {
        setNumberError('');
      }

      setCreditCardIcon(creditCardIcon);
    },
    [setNumber, setNumberError]
  );
  const onChangeYear = useCallback(
    (yearString: string) => {
      const yearNumber = toNumber(yearString);
      if (isNaN(yearNumber)) return;

      setYear(yearString);

      const currentYear = new Date().getFullYear();
      // TODO: Get upperbound limit year

      if (currentYear > yearNumber && yearString.length === 4) {
        setYearError('Digite um ano válido');
      } else {
        setYearError('');
      }
    },
    [setYear, setYearError]
  );
  const onChangeMonth = useCallback(
    (monthString: string) => {
      const monthNumber = toNumber(monthString);
      if (isNaN(monthNumber)) return;

      setMonth(monthString);

      // TODO: Dont show error when input is empty or only one zero
      if ((monthNumber < 1 || monthNumber > 12) && monthString.length === 2) {
        setMonthError('Digite um mês válido');
      } else {
        setMonthError('');
      }
    },
    [setMonth, setMonthError]
  );
  // refs
  const expirationMonthRef = React.useRef<TextInput>(null);
  const expirationYearRef = React.useRef<TextInput>(null);
  const cvvRef = React.useRef<TextInput>(null);
  const fullNameRef = React.useRef<TextInput>(null);

  // UI
  return (
    <ScrollView
      style={screens.config}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, padding }}>
          <PatternInput
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
            onChangeText={onChangeNumber}
            trailing={CreditCardIcon}
            errorMessage={numberError}
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
              onChangeText={onChangeMonth}
              errorMessage={monthError}
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
              onChangeText={onChangeYear}
              errorMessage={yearError}
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
              onSubmitEditing={() => fullNameRef.current?.focus()}
            />
          </View>
          <DefaultInput
            ref={fullNameRef}
            style={{ width: '100%', marginTop: padding }}
            title={t('Nome')}
            value={fullName}
            placeholder={t('Conforme cartão')}
            keyboardType="default"
            returnKeyType="next"
            textContentType="givenName"
            autoCompleteType="name"
            autoCapitalize="characters"
            blurOnSubmit
            onChangeText={setFullName}
          />
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ backgroundColor: colors.white, flex: 1, padding }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: padding }}>
            <Feather name="info" size={14} />
            <Text style={{ ...texts.md, marginLeft: halfPadding }}>
              {t('Informações sobre a cobrança')}
            </Text>
          </View>
          <Text style={{ ...texts.xs }}>
            {t(
              'Para sermos mais justos, o AppJusto cobra o valor total do pedido divido em duas cobranças no cartão. Por exemplo, se o seu pedido é no valor de R$ 10, vamos gerar duas cobranças que somadas custarão R$ 10.'
            )}
          </Text>
          <Text style={{ ...texts.xs, marginTop: padding }}>
            {t(
              'Cada uma dessas cobranças vai pra uma conta específica, facilitando a divisão entre restaurantes e entregadores/as.'
            )}
          </Text>
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ paddingVertical: padding }}
            title={t('Salvar')}
            onPress={saveCardHandler}
            disabled={!canSubmit || isLoading || !!numberError || !!monthError || !!yearError}
            activityIndicator={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

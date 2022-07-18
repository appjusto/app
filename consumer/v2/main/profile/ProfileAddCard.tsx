import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { toNumber, trim } from 'lodash';
import React, { ReactNode } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { AcceptedCreditCards } from '../../../../assets/icons/credit-card/AcceptedCreditCards';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import {
  cardFormatter,
  cardMask,
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import useAxiosCancelToken from '../../../../common/hooks/useAxiosCancelToken';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { OngoingOrderNavigatorParamList } from '../../ongoing/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import {
  getCardType,
  getCardTypeSVG,
  isCardTypeSupported,
  validateCard,
} from './payment/credit-card';
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
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [cvv, setCVV] = React.useState('');
  const [cardTypeLogo, setCardTypeLogo] = React.useState<ReactNode>(null);
  const [cardTypeFeedback, setCardTypeFeedback] = React.useState('');
  const [name, setName] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const cardValidation = validateCard({ number, month, year, cvv, name });

  // tracking
  useSegmentScreen('ProfileAddCard');
  // effects
  React.useEffect(() => {
    const type = getCardType(number);
    const isSupported = isCardTypeSupported(type);
    if (type && !isSupported) {
      setCardTypeFeedback(
        `${t('Não aceitamos ')}${
          type?.niceType ? `${t('a bandeira ')}${type.niceType}` : t('essa bandeira')
        }`
      );
    } else {
      setCardTypeFeedback(number.length < 16 ? t('O cartão de crédito deve ter 16 dígitos') : '');
      setCardTypeLogo(isSupported ? getCardTypeSVG(type!) : null);
    }
  }, [number]);
  // UI handlers
  const createCancelToken = useAxiosCancelToken();
  const saveCardHandler = async () => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      const firstName = trim(name.split(' ', 1).toString());
      const lastName = trim(name.split(' ').splice(1).join(' '));
      const result = await api.consumer().saveCard(
        {
          number,
          month,
          year: `20${year}`,
          verification_value: cvv,
          first_name: firstName.toLocaleUpperCase(),
          last_name: lastName.toLocaleUpperCase(),
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
        <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ paddingRight: halfPadding }}>{t('Bandeiras aceitas')}</Text>
          <AcceptedCreditCards />
        </PaddedView>

        <View style={{ flex: 1, padding }}>
          <PatternInput
            title={t('Número do cartão')}
            value={number}
            placeholder={t('0000 0000 0000 0000')}
            mask={cardMask}
            parser={numbersOnlyParser}
            formatter={cardFormatter}
            errorMessage={cardTypeFeedback}
            keyboardType="number-pad"
            textContentType="creditCardNumber"
            autoCompleteType="cc-number"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => {
              if (!isNaN(toNumber(text))) setNumber(text);
            }}
            onSubmitEditing={() => expirationMonthRef.current?.focus()}
          >
            {cardTypeLogo}
          </PatternInput>
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
              errorMessage={
                cardValidation === 'month-invalid'
                  ? t('Mês inválido')
                  : cardValidation === 'valid-thru-invalid'
                  ? t('Erro de validade')
                  : ''
              }
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
              placeholder={t('00')}
              maxLength={2}
              keyboardType="number-pad"
              returnKeyType="next"
              autoCompleteType="cc-exp-year"
              errorMessage={
                cardValidation === 'year-invalid'
                  ? t('Ano inválido')
                  : cardValidation === 'valid-thru-invalid'
                  ? t('Erro de validade')
                  : ''
              }
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
              errorMessage={cardValidation === 'cvv-invalid' ? t('Inválido') : ''}
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
            value={name}
            placeholder={t('Conforme cartão')}
            keyboardType="default"
            returnKeyType="next"
            textContentType="name"
            autoCompleteType="name"
            autoCapitalize="characters"
            blurOnSubmit
            onChangeText={setName}
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
              'Para sermos mais justos, o AppJusto cobra o valor total do pedido dividido em duas cobranças no cartão. Por exemplo, se o valor total do seu pedido é de R$ 30, vamos gerar duas cobranças que somadas custarão R$ 30.'
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
            disabled={cardValidation !== null || isLoading}
            activityIndicator={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

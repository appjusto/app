import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty, toNumber, trim } from 'lodash';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import {
  cardFormatter,
  cardMask,
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import useAxiosCancelToken from '../../../../common/hooks/useAxiosCancelToken';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { RestaurantNavigatorParamList } from '../../food/restaurant/types';
import { P2POrderNavigatorParamList } from '../../p2p/types';
import { ProfileParamList } from './types';

export type ProfileAddCardParamList = {
  ProfileAddCard?: {
    returnScreen?: 'FoodOrderCheckout' | 'CreateOrderP2P';
  };
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & RestaurantNavigatorParamList & P2POrderNavigatorParamList,
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
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const canSubmit =
    !isEmpty(number) &&
    !isEmpty(month) &&
    !isEmpty(year) &&
    !isEmpty(cvv) &&
    !isEmpty(name) &&
    !isEmpty(surname);
  // UI handlers
  const createCancelToken = useAxiosCancelToken();
  const saveCardHandler = async () => {
    try {
      setLoading(true);
      const result = await api.consumer().saveCard(
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
      if (returnScreen) {
        navigation.navigate(returnScreen, { paymentMethodId: result.paymentMethodId });
      } else navigation.pop();
    } catch (error) {
      setLoading(false);
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  // refs
  const expirationMonthRef = React.useRef<TextInput>(null);
  const expirationYearRef = React.useRef<TextInput>(null);
  const cvvRef = React.useRef<TextInput>(null);
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  // UI
  return (
    <ScrollView style={screens.config} contentContainerStyle={{ flexGrow: 1 }}>
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
              returnKeyType="done"
              blurOnSubmit
              onChangeText={setSurname}
            />
          </View>
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
              'Cada uma dessas cobranças vai pra uma conta específica, facilitando a divisão entre restaurantes e entregadores.'
            )}
          </Text>
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginVertical: padding }}
            title={t('Salvar')}
            onPress={saveCardHandler}
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

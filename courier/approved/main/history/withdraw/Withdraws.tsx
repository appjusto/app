import { Feather, Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { usePlatformParamsContext } from '../../../../../common/contexts/PlatformParamsContext';
import { useTotalWithdrawsThisMonth } from '../../../../../common/store/api/courier/account/useTotalWithdrawsThisMonth';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { showToast } from '../../../../../common/store/ui/actions';
import {
  borders,
  colors,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { convertBalance } from '../MarketplaceAccountInfo';
import { DeliveriesNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'Withdraws'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'Withdraws'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const Withdraws = ({ navigation, route }: Props) => {
  // params
  const { info } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const platformParams = usePlatformParamsContext();
  // redux
  const courier = useSelector(getCourier)!;
  // state
  const [withdrawing, setWithdrawing] = React.useState(false);
  // helpers
  const availableForWithdraw = info ? convertBalance(info.balance_available_for_withdraw) : 0;
  const minimum = 5;
  const withdrawsThisMonth = useTotalWithdrawsThisMonth(courier.id);
  const lastDayofThisMonth = dayjs().endOf('month').format('DD/MM/YYYY');
  // handler
  const withdrawHandler = async () => {
    if (!availableForWithdraw) return;
    if (
      (platformParams?.courier.restrictWithdrawTo.length ?? 0) > 0 &&
      !platformParams?.courier.restrictWithdrawTo.includes(courier.id)
    ) {
      dispatch(showToast('A transferência pelo App está limitada durante os testes.', 'error'));
      return;
    }
    setWithdrawing(true);
    try {
      const result = await api.courier().requestWithdraw(courier.id, availableForWithdraw);
      console.log(result);
      setWithdrawing(false);
      navigation.navigate('RequestWithdrawFeedback', {
        header: t('Requisição realizada com sucesso!'),
        description: t('O valor será transferido para sua conta em até 1 dia útil.'),
      });
    } catch (error) {
      console.log(error);
      Sentry.Native.captureException(error);
      dispatch(showToast('Não foi possível realizar a requisição. Tente novamente.', 'error'));
      setWithdrawing(false);
    }
  };
  //UI
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <PaddedView style={{ flex: 1 }}>
        <Text style={{ ...texts.sm }}>
          {t(
            'O AppJusto não fica com nada do valor do seu trabalho. Todas os pagamentos são processados com segurança pela operadora financeira Iugu.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: padding,
            marginTop: 24,
          }}
        >
          <Feather name="info" size={14} />
          <Text style={{ ...texts.md, marginLeft: halfPadding }}>{t('Como funciona')}</Text>
        </View>
        <Text style={{ ...texts.sm, paddingBottom: halfPadding }}>
          {t(
            'Você tem direito a 4 saques grátis a cada 30 dias. O valor mínimo para transferência é de R$5,00. Recomendamos que faça 1 saque por semana. Dessa forma, durante o período de 30 dias, você consegue sacar sem taxas adicionais. Caso precise de mais saques dentro desse mesmo período, será cobrada uma taxa de R$2,00 por saque adicional. Para solicitar saques adicionais, entre em contato com nosso suporte.'
          )}
        </Text>
        <PaddedView
          style={{
            marginTop: padding,
            ...borders.default,
            borderColor: colors.white,
            backgroundColor: colors.white,
          }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.black} />
              <Text
                style={{
                  ...texts.sm,
                  marginLeft: halfPadding,
                  paddingBottom: 2,
                }}
              >
                {t('Disponível para saque')}
              </Text>
            </View>
            {info === undefined ? (
              <ActivityIndicator
                style={{ marginVertical: 6 }}
                size="large"
                color={colors.green500}
              />
            ) : (
              <Text style={{ ...texts.x4l }}>{info.balance_available_for_withdraw}</Text>
            )}
            {withdrawsThisMonth === undefined ? (
              <ActivityIndicator
                style={{ marginVertical: 6 }}
                size="small"
                color={colors.green500}
              />
            ) : (
              <Text
                style={{
                  ...texts.xs,
                  color: colors.grey700,
                  paddingTop: halfPadding,
                  textAlign: 'center',
                }}
              >
                {t('Você possui')} {withdrawsThisMonth} {t('saques grátis até')}{' '}
                {lastDayofThisMonth}
              </Text>
            )}
          </View>
        </PaddedView>
        <View style={{ flex: 1 }} />
        <DefaultButton
          style={{ marginTop: padding }}
          title={t('Confirmar transferência')}
          activityIndicator={withdrawing}
          disabled={availableForWithdraw < minimum || withdrawing}
          onPress={withdrawHandler}
        />
      </PaddedView>
    </ScrollView>
  );
};

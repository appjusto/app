import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
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
import { formatCurrency } from '../../../../../common/utils/formatters';
import { usePlatformFees } from '../../../../../common/utils/platform/usePlatformFees';
import { usePlatformParams } from '../../../../../common/utils/platform/usePlatformParams';
import { t } from '../../../../../strings';
import { DeliveriesNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'Withdraws'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'Withdraws'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const convertBalance = (value: string) => parseInt(value.replace(/[^0-9]/g, ''), 10);

export const Withdraws = ({ navigation, route }: Props) => {
  // params
  const { info } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const platformFees = usePlatformFees();
  const platformParams = usePlatformParams();
  // redux
  const courier = useSelector(getCourier)!;
  // state
  const [withdrawing, setWithdrawing] = React.useState(false);
  // helpers
  const availableForWithdraw = info ? convertBalance(info.balance_available_for_withdraw) : 0;
  const minWithdrawValue = platformParams?.marketplace.minWithdrawValue ?? 600;
  const withdrawFee = platformFees.fees?.processing.iugu.withdraw;
  // handler
  const withdrawHandler = async () => {
    if (!availableForWithdraw) return;
    setWithdrawing(true);
    try {
      await api.courier().requestWithdraw(courier.id, availableForWithdraw);
      setWithdrawing(false);
      navigation.replace('RequestWithdrawFeedback', {
        header: t('Requisição realizada com sucesso!'),
        description: t('O valor será transferido para sua conta em até 1 dia útil.'),
      });
    } catch (error) {
      console.log(error);
      Sentry.Native.captureException(error);
      Keyboard.dismiss();
      dispatch(showToast('Não foi possível realizar a requisição. Tente novamente.', 'error'));
      setWithdrawing(false);
    }
  };
  //UI
  if (!withdrawFee) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
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
            'O AppJusto não fica com nada do valor do seu trabalho. Todos os pagamentos são processados com segurança pela operadora financeira Iugu, '
          )}
          <Text style={{ color: colors.red }}>
            {`${t('que cobra ')} ${formatCurrency(withdrawFee)} ${t(
              'por cada operação de saque.'
            )}`}
          </Text>
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
          </View>
          <View style={{ marginTop: padding }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.red} />
              <Text
                style={{
                  ...texts.sm,
                  marginLeft: halfPadding,
                  paddingBottom: 2,
                  color: colors.red,
                }}
              >
                {t('Taxa Iugu por saque')}
              </Text>
            </View>
            {info === undefined ? (
              <ActivityIndicator
                style={{ marginVertical: 6 }}
                size="large"
                color={colors.green500}
              />
            ) : (
              <Text style={{ ...texts.x4l }}>{formatCurrency(withdrawFee)}</Text>
            )}
          </View>
          <View style={{ marginTop: padding }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.black} />
              <Text
                style={{
                  ...texts.sm,
                  marginLeft: halfPadding,
                  paddingBottom: 2,
                }}
              >
                {t('Valor total do saque')}
              </Text>
            </View>
            {info === undefined ? (
              <ActivityIndicator
                style={{ marginVertical: 6 }}
                size="large"
                color={colors.green500}
              />
            ) : (
              <Text style={{ ...texts.x4l }}>
                {formatCurrency(availableForWithdraw - withdrawFee)}
              </Text>
            )}
          </View>
        </PaddedView>
        <View style={{ flex: 1 }} />
        <DefaultButton
          style={{ marginTop: padding }}
          title={t('Confirmar transferência')}
          activityIndicator={withdrawing}
          disabled={availableForWithdraw < minWithdrawValue || withdrawing}
          onPress={withdrawHandler}
        />
      </PaddedView>
    </ScrollView>
  );
};

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HR from '../../../../common/components/views/HR';
import { IconWalletSmall } from '../../../../common/icons/icon-wallet-small';
import { useMarketplaceAccountInfo } from '../../../../common/store/api/courier/account/useMarketplaceAccountInfo';
import { getCourier } from '../../../../common/store/courier/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatDate } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainParamList, 'DeliveryHistory'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<MainParamList, 'DeliveryHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

const convertBalance = (value: string) =>
  parseFloat(value.replace(',', '.').replace(/[^0-9.]/g, ''));

export const MarketplaceAccountInfo = () => {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const courier = useSelector(getCourier)!;
  // state
  const [withdrawing, setWithdrawing] = React.useState(false);
  // side effects
  const info = useMarketplaceAccountInfo();
  const availableForWithdraw = info ? convertBalance(info.balance_available_for_withdraw) : 0;
  const receivableBalance = info ? convertBalance(info.receivable_balance) : 0;
  const minimum = 5;
  // handlers
  const withdrawHandler = async () => {
    if (!availableForWithdraw) return;
    setWithdrawing(true);
    try {
      const result = await api.courier().requestWithdraw(courier.id, availableForWithdraw);
      console.log(result);
      setWithdrawing(false);
      navigation.navigate('DeliveriesNavigator', {
        screen: 'RequestWithdrawFeedback',
        params: {
          header: t('Requisição realizada com sucesso!'),
          description: t('O valor será transferido para sua conta em até 1 dia útil.'),
        },
      });
    } catch (error) {
      console.log(error);
      Sentry.Native.captureException(error);
      dispatch(showToast('Não foi possível realizar a requisição. Tente novamente.', 'error'));
      setWithdrawing(false);
    }
  };
  const advanceHandler = () =>
    navigation.navigate('DeliveriesNavigator', {
      screen: 'Receivables',
      params: {
        receivableBalance: info!.receivable_balance,
      },
    });
  // UI
  return (
    <View>
      <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconWalletSmall />
        <Text style={{ ...texts.md, marginLeft: halfPadding }}>{`${t('Saldo em')} ${formatDate(
          new Date()
        )}`}</Text>
      </PaddedView>
      <HR color={colors.grey500} />
      <PaddedView>
        <PaddedView
          style={{
            marginTop: halfPadding,
            ...borders.default,
            borderColor: colors.white,
            backgroundColor: colors.white,
          }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.grey700} />
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
            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Transferir para conta')}
              activityIndicator={withdrawing}
              disabled={availableForWithdraw < minimum || withdrawing}
              onPress={withdrawHandler}
            />
            <Text
              style={{
                ...texts.xs,
                color: colors.grey700,
                paddingTop: halfPadding,
                textAlign: 'center',
              }}
            >
              {t('Valor mínimo de R$ 5,00 para transferência')}
            </Text>
          </View>
        </PaddedView>
        <PaddedView
          style={{
            ...borders.default,
            borderColor: colors.white,
            backgroundColor: colors.white,
            marginTop: padding,
          }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="timer" size={20} color={colors.grey700} />
              <Text
                style={{
                  ...texts.sm,
                  color: colors.grey700,
                  marginLeft: halfPadding,
                  paddingBottom: 2,
                }}
              >
                {t('Em faturamento')}
              </Text>
            </View>
            {info === undefined ? (
              <ActivityIndicator
                style={{ marginVertical: 6 }}
                size="large"
                color={colors.green500}
              />
            ) : (
              <Text style={{ ...texts.x4l }}>{info.receivable_balance}</Text>
            )}
            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Antecipar valores')}
              // disabled={receivableBalance === 0}
              onPress={advanceHandler}
              secondary
            />
          </View>
        </PaddedView>
      </PaddedView>
    </View>
  );
};

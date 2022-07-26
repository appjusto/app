import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { useMarketplaceAccountInfo } from '../../../../common/store/api/courier/account/useMarketplaceAccountInfo';
import { useCourierRecentOrdersRevenue } from '../../../../common/store/api/order/courier/useCourierRecentOrdersRevenue';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
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

export const convertBalance = (value: string) =>
  parseFloat(value.replace(',', '.').replace(/[^0-9.]/g, ''));

export const MarketplaceAccountInfo = () => {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  // state
  const info = useMarketplaceAccountInfo();
  const revenue = useCourierRecentOrdersRevenue();
  // UI
  if (!info || !revenue) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const availableForWithdraw = convertBalance(info.balance_available_for_withdraw);
  const minimum = 5;
  return (
    <View>
      <PaddedView>
        {/* available for withdraw */}
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

            <Text style={{ ...texts.x4l }}>{info.balance_available_for_withdraw}</Text>

            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Transferir para conta')}
              disabled={availableForWithdraw < minimum}
              onPress={() =>
                navigation.navigate('DeliveriesNavigator', {
                  screen: 'Withdraws',
                  params: {
                    info,
                  },
                })
              }
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
        {/* advance */}
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

            <Text style={{ ...texts.x4l }}>{info.receivable_balance}</Text>

            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Antecipar valores')}
              onPress={() =>
                navigation.navigate('DeliveriesNavigator', {
                  screen: 'Receivables',
                  params: {
                    receivableBalance: info!.receivable_balance,
                  },
                })
              }
              variant="secondary"
            />
          </View>
        </PaddedView>
        {/* week summary */}
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
              <MaterialIcons name="account-balance-wallet" size={20} color={colors.grey700} />
              <Text
                style={{
                  ...texts.sm,
                  color: colors.grey700,
                  marginLeft: halfPadding,
                  paddingBottom: 2,
                }}
              >
                {t('Resumo da semana')}
              </Text>
            </View>

            <Text style={{ ...texts.x4l }}>{formatCurrency(revenue.week)}</Text>

            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Ver corridas da semana')}
              onPress={() =>
                navigation.navigate('DeliveriesNavigator', {
                  screen: 'DeliveryHistoryByMonth',
                })
              }
              variant="secondary"
            />
          </View>
        </PaddedView>
      </PaddedView>
    </View>
  );
};

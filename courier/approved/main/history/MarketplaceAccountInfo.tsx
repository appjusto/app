import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HR from '../../../../common/components/views/HR';
import { IconWalletSmall } from '../../../../common/icons/icon-wallet-small';
import { useMarketplaceAccountInfo } from '../../../../common/store/api/courier/account/useMarketplaceAccountInfo';
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

export const convertBalance = (value: string) =>
  parseFloat(value.replace(',', '.').replace(/[^0-9.]/g, ''));

export const MarketplaceAccountInfo = () => {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  // side effects
  const info = useMarketplaceAccountInfo();
  // helpers
  const availableForWithdraw = info ? convertBalance(info.balance_available_for_withdraw) : 0;
  const minimum = 5;
  // handlers
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
              onPress={advanceHandler}
              disabled={!info}
              secondary
            />
          </View>
        </PaddedView>
      </PaddedView>
    </View>
  );
};

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { useMarketplaceAccountInfo } from '../../../../common/store/api/courier/account/useMarketplaceAccountInfo';
import { useCourierRecentOrdersRevenue } from '../../../../common/store/api/order/courier/useCourierRecentOrdersRevenue';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { usePlatformParams } from '../../../../common/utils/platform/usePlatformParams';
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

const Stack = createStackNavigator();
export default function ({ navigation, route }: Props) {
  // state
  const info = useMarketplaceAccountInfo();
  const revenue = useCourierRecentOrdersRevenue();
  const platformParams = usePlatformParams();
  const minWithdrawValue = platformParams?.marketplace.minWithdrawValue ?? 600;
  // tracking
  useSegmentScreen('DeliveryHistory');
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
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DeliveryHistory"
        options={{ title: 'Suas corridas' }}
        children={() => (
          <ScrollView
            style={[screens.config]}
            contentContainerStyle={{ flexGrow: 1 }}
            scrollIndicatorInsets={{ right: 1 }}
          >
            <View>
              <PaddedView>
                {/* available for withdraw */}
                <PaddedView
                  style={{
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
                      {`${t('Valor mínimo de')} ${formatCurrency(minWithdrawValue)} ${t(
                        'para transferência'
                      )}`}
                    </Text>
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
                      <MaterialIcons
                        name="account-balance-wallet"
                        size={20}
                        color={colors.grey700}
                      />
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
                      title={t('Ver histórico de corridas')}
                      onPress={() =>
                        navigation.navigate('DeliveriesNavigator', {
                          screen: 'DeliveryHistoryByWeek',
                        })
                      }
                      variant="secondary"
                    />
                  </View>
                </PaddedView>
              </PaddedView>
            </View>
          </ScrollView>
        )}
      />
    </Stack.Navigator>
  );
}

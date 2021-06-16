import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React, { useMemo } from 'react';
import { Image, SectionList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import ShowIf from '../../../../common/components/views/ShowIf';
import { IconMotocycle } from '../../../../common/icons/icon-motocycle';
import { useObserveOrders } from '../../../../common/store/api/order/hooks/useObserveOrders';
import { useSegmentScreen } from '../../../../common/store/api/track';
import {
  getMonthsWithOrdersInYear,
  getOrdersWithFilter,
  getYearsWithOrders,
  summarizeOrders,
} from '../../../../common/store/order/selectors';
import { getUser } from '../../../../common/store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { getMonthName } from '../../../../common/utils/formatters/datetime';
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

const Stack = createStackNavigator();
export default function ({ navigation, route }: Props) {
  // app state
  const user = useSelector(getUser);
  // screen state
  const options = React.useMemo(() => ({ courierId: user?.uid }), [user?.uid]);
  const orders = useObserveOrders(options);
  const yearsWithOrders = getYearsWithOrders(orders);
  const monthsWithOrdersInYears = getMonthsWithOrdersInYear(orders);

  // screen state
  // data structure
  // [ { title: '2020', data: [ { monthName: 'Agosto', deliveries: 3, courierFee: 100 }] }]
  const sections = useMemo(() => {
    return yearsWithOrders.map((year) => {
      const monthsInYear = monthsWithOrdersInYears(year);

      return {
        title: String(year),
        data: monthsInYear.map((month) => ({
          key: `${year}-${month}`,
          year,
          month,
          ...summarizeOrders(getOrdersWithFilter(orders, year, month)),
        })),
      };
    });
  }, [yearsWithOrders]);
  // side effects
  // tracking
  useSegmentScreen('Delivery History');
  // UI
  const paddingTop = Constants.statusBarHeight;
  if (sections.length === 0) {
    return (
      <FeedbackView
        header={t('Seu histórico está vazio')}
        description={t('Você ainda não fez nenhuma corrida')}
        icon={<IconMotocycle />}
        background={colors.grey50}
      />
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeliveryHistory"
        options={{ title: 'Suas corridas' }}
        children={() => (
          <View style={{ ...screens.config }}>
            <SectionList
              style={{ flex: 1 }}
              sections={sections}
              keyExtractor={(item) => item.key}
              renderSectionHeader={({ section }) => (
                <PaddedView
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: colors.grey500,
                    borderBottomWidth: 1,
                  }}
                >
                  <Image source={icons.calendar} />
                  <Text style={{ ...texts.md, marginLeft: padding }}>{section.title}</Text>
                </PaddedView>
              )}
              renderItem={({ item }) => {
                const title = getMonthName(item.month);
                const subtitle =
                  item.delivered +
                  t(' corridas finalizadas') +
                  '\n' +
                  t('Total recebido: ') +
                  formatCurrency(item.courierFee);
                return (
                  <ConfigItem
                    title={title}
                    subtitle={subtitle}
                    onPress={() =>
                      navigation.navigate('DeliveriesNavigator', {
                        screen: 'DeliveryHistoryByMonth',
                        params: {
                          year: item.year,
                          month: item.month,
                        },
                      })
                    }
                  >
                    <ShowIf test={item.ongoing > 0}>
                      {() => (
                        <View style={{ marginTop: halfPadding }}>
                          <RoundedText backgroundColor={colors.yellow}>
                            {t('Corrida em andamento')}
                          </RoundedText>
                        </View>
                      )}
                    </ShowIf>
                  </ConfigItem>
                );
              }}
              // ListHeaderComponent={
              //   sections.length > 0 ? (
              //     <View style={{ ...screens.default }}>
              //       <PaddedView
              //         style={{
              //           flexDirection: 'row',
              //           justifyContent: 'space-between',
              //           alignItems: 'center',
              //         }}
              //       >
              //         <View>
              //           <Text style={{ ...texts.sm, color: colors.grey700 }}>
              //             {t('Disponível para saque:')}
              //           </Text>
              //           <Text style={{ ...texts.xl }}>{t('R$ XXXX')}</Text>
              //         </View>
              //         <View>
              //           <Text style={{ ...texts.sm, color: colors.grey700 }}>
              //             {t('Compensando:')}
              //           </Text>
              //           <Text style={{ ...texts.xl }}>{t('R$ XXXX')}</Text>
              //         </View>
              //       </PaddedView>
              //       <View
              //         style={{
              //           flexDirection: 'row',
              //           justifyContent: 'space-between',
              //           alignItems: 'center',
              //           paddingHorizontal: padding,
              //           paddingBottom: padding,
              //         }}
              //       >
              //         <View style={{ width: '48%' }}>
              //           <DefaultButton
              //             title={t('Transferir saque')}
              //             onPress={() =>
              //               navigation.navigate('PaymentNavigator', {
              //                 screen: 'Payment',
              //                 params: { operation: 'withdraw' },
              //               })
              //             }
              //           />
              //         </View>
              //         <View style={{ width: '48%' }}>
              //           <DefaultButton
              //             title={t('Adiantar valores')}
              //             style={{ backgroundColor: colors.yellow, borderColor: colors.yellow }}
              //             onPress={() =>
              //               navigation.navigate('PaymentNavigator', {
              //                 screen: 'Payment',
              //                 params: { operation: 'antecipate' },
              //               })
              //             }
              //           />
              //         </View>
              //       </View>
              //     </View>
              //   ) : null
              // }
            />
          </View>
        )}
      />
    </Stack.Navigator>
  );
}

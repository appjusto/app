import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { View, SectionList, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/views/PaddedView';
import {
  getYearsWithOrders,
  getMonthsWithOrdersInYear,
  getOrdersWithFilter,
  summarizeOrders,
} from '../../../common/store/order/selectors';
import { screens, texts, padding, colors } from '../../../common/styles';
import { getMonthName } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryNavigatorParamList, 'DeliveryHistory'>;
type ScreenRoute = RouteProp<HistoryNavigatorParamList, 'DeliveryHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // app state
  const yearsWithOrders = useSelector(getYearsWithOrders);
  const monthsWithOrdersInYears = useSelector(getMonthsWithOrdersInYear);
  const ordersWithFilter = useSelector(getOrdersWithFilter);

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
          ...summarizeOrders(ordersWithFilter(year, month)),
        })),
      };
    });
  }, [yearsWithOrders]);

  // UI
  return (
    <View style={{ ...screens.default, marginTop: padding }}>
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.key}
        renderSectionHeader={({ section }) => (
          <PaddedView
            style={{ flexDirection: 'row', borderBottomColor: colors.grey, borderBottomWidth: 1 }}
          >
            <Image source={icons.calendar} />
            <Text style={{ ...texts.medium, marginLeft: padding }}>{section.title}</Text>
          </PaddedView>
        )}
        renderItem={({ item }) => (
          <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 1 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DeliveryHistoryByMonth', {
                  year: item.year,
                  month: item.month,
                })
              }
            >
              <PaddedView>
                <Text style={{ ...texts.medium, marginBottom: padding }}>
                  {getMonthName(item.month)}
                </Text>
                <Text style={[texts.medium, { color: colors.darkGrey }]}>
                  {item.deliveries} {t('corridas finalizadas')}
                </Text>
                <Text style={[texts.medium, { color: colors.darkGrey }]}>
                  {t('Total recebido: R$ ')}
                  {item.courierFee}
                </Text>
              </PaddedView>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

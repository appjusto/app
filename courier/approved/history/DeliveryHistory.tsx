import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React, { useMemo } from 'react';
import { View, SectionList, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import ConfigItem from '../../../common/components/views/ConfigItem';
import FeedbackView from '../../../common/components/views/FeedbackView';
import ShowIf from '../../../common/components/views/ShowIf';
import {
  getYearsWithOrders,
  getMonthsWithOrdersInYear,
  getOrdersWithFilter,
  summarizeOrders,
  getOrders,
} from '../../../common/store/order/selectors';
import { screens, texts, padding, halfPadding, colors } from '../../../common/styles';
import { getMonthName, formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { DeliveriesNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'DeliveryHistory'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'DeliveryHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // app state
  const orders = useSelector(getOrders);
  const yearsWithOrders = useSelector(getYearsWithOrders);
  const monthsWithOrdersInYears = useSelector(getMonthsWithOrdersInYear);

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

  // UI
  const paddingTop = Constants.statusBarHeight;
  if (sections.length === 0) {
    return (
      <FeedbackView
        header={t('Seu histórico está vazio')}
        description={t('Você ainda não fez nenhuma corrida')}
        icon={icons.motocycle}
        background={colors.lightGrey}
      />
    );
  }

  return (
    <View style={{ ...screens.configScreen }}>
      <SectionList
        style={{ flex: 1, paddingTop }}
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
                navigation.navigate('DeliveryHistoryByMonth', {
                  year: item.year,
                  month: item.month,
                })
              }
            >
              <ShowIf test={item.dispatching > 0}>
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
      />
    </View>
  );
}

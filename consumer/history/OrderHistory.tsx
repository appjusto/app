import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React, { useMemo } from 'react';
import { View, SectionList, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

import * as icons from '../../assets/icons';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import StatusBadge from '../../common/components/views/StatusBadge';
import { getYearsWithOrders, getOrdersWithFilter } from '../../common/store/order/selectors';
import { screens, texts, padding, colors } from '../../common/styles';
import { formatTime, formatDate, separateWithDot } from '../../common/utils/formatters';
import { HomeNavigatorParamList } from '../home/types';
import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HistoryNavigatorParamList, 'OrderHistory'>,
  BottomTabNavigationProp<HomeNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<HistoryNavigatorParamList, 'OrderHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // app state
  const yearsWithOrders = useSelector(getYearsWithOrders);
  const ordersWithFilter = useSelector(getOrdersWithFilter);

  // screen state
  // data structure
  // [ { title: '2020', data: [ { monthName: 'Agosto', deliveries: 3, courierFee: 100 }] }]
  const sections = useMemo(() => {
    return yearsWithOrders.map((year) => {
      const ordersInYear = ordersWithFilter(year);

      return {
        title: String(year),
        data: ordersInYear,
      };
    });
  }, [yearsWithOrders]);

  // UI
  const paddingTop = Constants.statusBarHeight;
  return (
    <View style={{ ...screens.configScreen }}>
      <SectionList
        style={{ flex: 1, paddingTop }}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <PaddedView
            style={{ flexDirection: 'row', borderBottomColor: colors.grey, borderBottomWidth: 1 }}
          >
            <Image source={icons.calendar} />
            <Text style={{ ...texts.medium, marginLeft: padding }}>{section.title}</Text>
          </PaddedView>
        )}
        renderItem={({ item }) => {
          const createdOn = (item.createdOn as firebase.firestore.Timestamp).toDate();
          const title = item.origin.address.main;
          const subtitle = separateWithDot(formatDate(createdOn), formatTime(createdOn));
          return (
            <ConfigItem
              title={title}
              subtitle={subtitle}
              onPress={() => {
                if (item.status === 'quote') {
                  navigation.navigate('CreateOrderP2P', { orderId: item.id });
                } else {
                  navigation.navigate('OrderDetail', {
                    orderId: item.id,
                  });
                }
              }}
            >
              <StatusBadge status={item.status} />
            </ConfigItem>
          );
        }}
      />
    </View>
  );
}

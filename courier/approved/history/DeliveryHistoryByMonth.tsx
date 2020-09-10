import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import PaddedView from '../../../common/components/views/PaddedView';
import { getOrdersWithFilter } from '../../../common/store/order/selectors';
import { screens, texts, padding, colors } from '../../../common/styles';
import { hhMMFromDate, formatCurrency } from '../../../common/utils/formatters';
import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<
  HistoryNavigatorParamList,
  'DeliveryHistoryByMonth'
>;
type ScreenRoute = RouteProp<HistoryNavigatorParamList, 'DeliveryHistoryByMonth'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const { year, month } = route.params;
  // app state
  const orders = useSelector(getOrdersWithFilter)(year, month);

  // UI
  return (
    <View style={{ ...screens.configScreen }}>
      <FlatList
        style={{ flex: 1 }}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => null}>
              <PaddedView>
                <Text style={{ ...texts.medium, marginBottom: padding }}>
                  {formatCurrency(item.fare.courierFee)}
                </Text>
                <Text style={[texts.medium, { color: colors.darkGrey }]}>
                  {item.origin.address}
                </Text>
                <Text style={[texts.medium, { color: colors.darkGrey }]}>
                  {hhMMFromDate(item.createdOn.toDate())}
                </Text>
              </PaddedView>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

import { Fare } from '@appjusto/types';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { RestaurantNavigatorParamList } from '../food/restaurant/types';
import { P2POrderNavigatorParamList } from '../p2p/types';
import { FleetListItem } from './FleetListItem';

type ScreenNavigationProp = StackNavigationProp<
  P2POrderNavigatorParamList & RestaurantNavigatorParamList,
  'AvailableFleets'
>;
type ScreenRouteProp = RouteProp<
  P2POrderNavigatorParamList & RestaurantNavigatorParamList,
  'AvailableFleets'
>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const AvailableFleets = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const order = useObserveOrder(orderId);
  const [quotes, setQuotes] = React.useState<Fare[]>();
  const [selectedFare, setSelectedFare] = React.useState<Fare>();
  // side effects
  // update quotes if order changes
  React.useEffect(() => {
    getOrderQuotesHandler();
  }, [order]);
  // select first fare and subscribe to involved fleets updates
  // React.useEffect(() => {
  //   if (!quotes || isEmpty(quotes)) return;
  //   setSelectedFare(quotes[0]);
  // }, [quotes]);
  // handlers
  const getOrderQuotesHandler = React.useCallback(async () => {
    if (!order) return;
    if (!order.origin?.location || !order.route?.distance) {
      if (order.route?.issue) dispatch(showToast(order.route.issue, 'error'));
      return;
    }
    setQuotes(undefined);
    try {
      setQuotes(await api.order().getOrderQuotes(order.id));
    } catch (error: any) {
      dispatch(showToast(error.toString(), 'error'));
    }
  }, [order, api, dispatch]);
  // UI
  // UI
  if (!order || !quotes) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <ScrollView
      style={{ ...screens.default }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <PaddedView style={{ flex: 1 }}>
        <View>
          <Text style={{ ...texts.x2l }}>
            {t('Você escolhe a frota e o entregador fica com todo o dinheiro da entrega')}
          </Text>
          {/* <Text style={{ ...texts.sm, marginTop: padding, color: colors.grey700 }}>
            {t(
              'Você pode selecionar mais de uma frota ao mesmo tempo. O valor final será definido após o aceite da corrida. Frotas disponíveis agora:'
            )}
          </Text> */}
        </View>
        <View style={{ marginTop: padding }}>
          {quotes.map((item) => {
            return (
              <View key={item.fleet.id} style={{ marginBottom: padding }}>
                <FleetListItem
                  item={item}
                  selectedFare={selectedFare?.fleet.id === item.fleet.id}
                  onFareSelect={() => setSelectedFare(item)}
                  onFleetDetail={() => null}
                />
              </View>
            );
          })}
        </View>
      </PaddedView>
    </ScrollView>
  );
};

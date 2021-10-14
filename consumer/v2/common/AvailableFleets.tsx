import { Fare } from '@appjusto/types';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useQuotes } from '../../../common/store/api/order/hooks/useQuotes';
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
  // state
  const order = useObserveOrder(orderId);
  const [selectedFare, setSelectedFare] = React.useState<Fare>();
  const quotes = useQuotes(orderId);
  // UI
  if (!order || !quotes) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  console.log(quotes);
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
                  onFareSelect={(item) => setSelectedFare(item)}
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

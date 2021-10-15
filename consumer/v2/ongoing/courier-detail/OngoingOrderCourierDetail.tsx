import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { LoggedNavigatorParamList } from '../../types';
import { OngoingOrderNavigatorParamList } from '../types';
import { OrderCourierSummary } from './OrderCourierSummary';
import { OrderFleetSummary } from './OrderFleetSummary';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderCourierDetail'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderCourierDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderCourierDetail = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params ?? {};
  //context
  const order = useObserveOrder(orderId);
  // tracking
  useSegmentScreen('OngoingOrderCourierDetail');
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.white }} scrollIndicatorInsets={{ right: 1 }}>
      <View style={{ paddingBottom: padding }}>
        <OrderCourierSummary courier={order.courier!} />
        <SingleHeader title={t('Integrante da frota')} />
        <View
          style={{ paddingHorizontal: padding, paddingBottom: padding, paddingTop: halfPadding }}
        >
          <OrderFleetSummary fleetId={order.fare!.fleet.id} />
        </View>
      </View>
      <View>
        <View
          style={{
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: colors.grey500,
            marginBottom: padding,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: padding,
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 7 }}>
            <DefaultButton
              title={t('Abrir chat')}
              onPress={() => {
                track('opening chat with courier');
                navigation.navigate('OngoingOrderChat', {
                  orderId,
                  counterpartId: order.courier!.id,
                  counterpartFlavor: 'courier',
                });
              }}
            />
          </View>
          {/* <View style={{ marginLeft: halfPadding, flex: 7 }}>
            <DefaultButton title={t('Ligar')} onPress={() => null} secondary />
          </View> */}
        </View>
        <Text
          style={{
            ...texts.xs,
            color: colors.grey700,
            paddingHorizontal: padding,
            paddingBottom: padding,
          }}
        >
          {t('Ao ligar, seu número será protegido e o/a entregador/a não verá seu telefone real.')}
        </Text>
      </View>
    </ScrollView>
  );
};

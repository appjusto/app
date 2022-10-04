import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { colors, screens } from '../../../../common/styles';
import { LoggedNavigatorParamList } from '../../types';
import { OngoingOrderNavigatorParamList } from '../types';
import { OrderConfirmingCreditFood } from './credit/OrderConfirmingCreditFood';
import { OrderConfirmingCreditP2P } from './credit/OrderConfirmingCreditP2P';
import { OrderConfirmingPix } from './pix/OrderConfirmingPix';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirming'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirming'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderConfirming = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // screen state
  const order = useObserveOrder(orderId);
  // side effects
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'canceled' || order.status === 'rejected') {
      navigation.replace('OrderCanceled', { orderId });
    } else if (order.status === 'confirmed' || order.status === 'scheduled') {
      if (order.type === 'food') {
        navigation.replace('OngoingOrder', {
          orderId,
        });
      }
    } else if (order.status === 'dispatching') {
      if (order.type === 'p2p') {
        navigation.replace('OngoingOrder', {
          orderId,
        });
      }
    } else if (order.status === 'declined') {
      // when payment is not approved
      navigation.replace('OngoingOrderDeclined', { orderId });
    } else if (order.dispatchingStatus === 'no-match') {
      navigation.navigate('OngoingOrderNoMatch', { orderId });
    } else if (order.dispatchingStatus === 'outsourced') {
      navigation.replace('OngoingOrder', { orderId });
    }
  }, [navigation, order, orderId]);
  // tracking
  useSegmentScreen('OrderConfirming');
  // handlers
  const navigateToCancelOrder = () => {
    navigation.navigate('OngoingOrderConfirmCancel', { orderId });
  };
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  console.log(order.status);
  console.log(order.dispatchingStatus);
  const { paymentMethod, type, scheduledTo, dispatchingStatus } = order;
  if (paymentMethod === 'pix') {
    if (type === 'p2p') {
      if (dispatchingStatus === 'matching') {
        return <OrderConfirmingCreditP2P onCancel={navigateToCancelOrder} />;
      }
    }
    return <OrderConfirmingPix order={order} onCancel={navigateToCancelOrder} />;
  }
  if (type === 'food') {
    return (
      <OrderConfirmingCreditFood
        onCancel={navigateToCancelOrder}
        onGoHome={() => {
          navigation.replace('MainNavigator', { screen: 'Home' });
        }}
        scheduledOrder={!!scheduledTo}
      />
    );
  }
  if (type === 'p2p') {
    return <OrderConfirmingCreditP2P onCancel={navigateToCancelOrder} />;
  }
  return null;
};

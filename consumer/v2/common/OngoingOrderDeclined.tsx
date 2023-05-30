import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { OngoingOrderNavigatorParamList } from '../ongoing/types';
import { LoggedNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderDeclined'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderDeclined'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderDeclined = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  // screen state
  const order = useObserveOrder(orderId);
  // after 1 hour, the status turns into 'canceled'
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'quote') {
      if (order.type === 'p2p') {
        navigation.replace('P2POrderNavigator', {
          screen: 'CreateOrderP2P',
          params: {
            orderId: order.id,
          },
        });
      } else {
        navigation.replace('FoodOrderNavigator', {
          screen: 'RestaurantNavigator',
          params: {
            restaurantId: order.business!.id,
            orderId: order.id,
            screen: 'FoodOrderCheckout',
          },
        });
      }
    } else if (order.status === 'canceled' || order.status === 'rejected') {
      navigation.navigate('OrderCanceled', { orderId });
    }
  }, [navigation, order, orderId]);
  // tracking
  useSegmentScreen('OngoingOrderDeclined');
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handlers
  const reviewOrderHandler = () => {
    if (!order) return;
    api.order().updateOrder(order.id, { status: 'quote' }).then(null);
  };
  const header = (() => {
    if (order.status === 'canceled') return t('Esse pedido foi cancelado');
    else return `${t('Problemas no pagamento\n')}${order.issue ?? ''}`;
  })();
  const description = (() => {
    return t(
      'Não conseguimos efetuar a cobrança. Por favor, altere a forma de pagamento e tente novamente.'
    );
  })();
  // UI
  return (
    <ScrollView
      style={{ ...screens.default }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <FeedbackView
        header={header}
        description={description}
        icon={<IconConeYellow />}
        background={colors.white}
      >
        {order.status === 'declined' ? (
          <View style={{ paddingVertical: padding }}>
            <DefaultButton
              title={t('Revisar pedido')}
              variant="secondary"
              onPress={() => reviewOrderHandler()}
            />
          </View>
        ) : null}
        {order.status === 'canceled' ? (
          <View style={{ paddingVertical: padding }}>
            <DefaultButton
              title={t('Voltar para o início')}
              variant="secondary"
              onPress={() => {
                navigation.replace('MainNavigator', { screen: 'Home' });
              }}
            />
          </View>
        ) : null}
      </FeedbackView>
    </ScrollView>
  );
};

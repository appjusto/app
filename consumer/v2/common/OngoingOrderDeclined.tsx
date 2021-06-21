import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
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
  // screen state
  const order = useObserveOrder(orderId);
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handlers
  const changePaymentHandler = () => {
    if (order.type === 'p2p')
      navigation.navigate('P2POrderNavigator', {
        screen: 'ProfilePaymentMethods',
        params: { returnScreen: 'CreateOrderP2P' },
      });
    else
      navigation.navigate('FoodOrderNavigator', {
        screen: 'RestaurantNavigator',
        params: {
          restaurantId: order.business!.id,
          screen: 'ProfilePaymentMethods',
          params: { returnScreen: 'FoodOrderCheckout' },
        },
      });
  };
  const reviewOrderHandler = () => {
    if (order?.type === 'p2p') {
      navigation.navigate('P2POrderNavigator', { screen: 'CreateOrderP2P', params: { orderId } });
    } else {
      navigation.navigate('FoodOrderNavigator', {
        screen: 'RestaurantNavigator',
        params: { restaurantId: order.business!.id, screen: 'FoodOrderCheckout' },
      });
    }
  };

  return (
    <ScrollView style={{ ...screens.default }} contentContainerStyle={{ flexGrow: 1 }}>
      <FeedbackView
        header={t('Problemas no pagamento')}
        description={t(
          'Não conseguimos efetuar a cobrança na forma de pagamento escolhida. Por favor, altere a forma de pagamento e tente novamente.'
        )}
        icon={<IconConeYellow />}
        background={colors.white}
      >
        <DefaultButton title={t('Alterar forma de pagamento')} onPress={changePaymentHandler} />
        {order.type === 'food' && order.dispatchingStatus === 'declined' ? null : (
          <DefaultButton
            title={t('Revisar pedido')}
            secondary
            style={{ marginVertical: padding }}
            onPress={reviewOrderHandler}
          />
        )}
        {/* <DefaultButton
          title={t('Revisar pedido')}
          secondary
          style={{ marginVertical: padding }}
          onPress={reviewOrderHandler}
        /> */}
      </FeedbackView>
    </ScrollView>
  );
};

import { Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconProblemChat } from '../../../common/icons/icon-problem-chat';
import HomeCard from '../../../common/screens/home/cards/HomeCard';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { DeliveryProblemCard } from './delivery-problem/DeliveryProblemCard';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'DeliveryProblem'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'DeliveryProblem'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const DeliveryProblem = ({ navigation, route }: Props) => {
  // params
  const { orderId, chatFrom } = route.params;
  // screen state
  const order = useObserveOrder(orderId);
  const businessId = order?.business?.id;
  // helpers
  const openChat = React.useCallback(
    (counterpartId: string, counterpartFlavor: Flavor, delayed?: boolean) => {
      setTimeout(
        () => {
          navigation.navigate('Chat', {
            orderId,
            counterpartId,
            counterpartFlavor,
          });
        },
        delayed ? 100 : 0
      );
    },
    [navigation, orderId]
  );
  //handlers
  const openChatWithRestaurant = React.useCallback(
    (delayed?: boolean) => openChat(businessId!, 'business', delayed),
    [openChat, businessId]
  );
  const refuseDeliveryHandler = () => {
    if (!order) return;
    if (order.type === 'food') {
      navigation.navigate('CourierDropsOrder', {
        orderId,
        issueType: 'courier-drops-food-delivery',
      });
    } else {
      navigation.navigate('CourierDropsOrder', {
        orderId,
        issueType: 'courier-drops-p2p-delivery',
      });
    }
  };

  const deliveryProblemHandler = () => {
    if (!order) return;
    if (order.type === 'food') {
      if (order.dispatchingState === 'arrived-pickup') {
        navigation.navigate('ReportIssue', {
          issueType: 'courier-pickup-food-delivery',
          orderId,
        });
      } else if (order.dispatchingState === 'going-destination') {
        navigation.navigate('ReportIssue', {
          issueType: 'courier-delivering-food-order',
          orderId,
        });
      } else if (order.dispatchingState === 'arrived-destination') {
        navigation.navigate('ReportIssue', {
          issueType: 'courier-destination-food',
          orderId,
        });
      }
    } else if (order.type === 'p2p') {
      if (order.dispatchingState === 'arrived-pickup') {
        navigation.navigate('ReportIssue', {
          issueType: 'courier-pickup-p2p-delivery',
          orderId,
        });
      } else if (order.dispatchingState === 'going-destination') {
        navigation.navigate('ReportIssue', {
          issueType: 'courier-delivering-p2p-order',
          orderId,
        });
      } else if (order.dispatchingState === 'arrived-destination') {
        navigation.navigate('ReportIssue', {
          issueType: 'courier-destination-p2p',
          orderId,
        });
      }
    }
  };
  // open chat if there's a new message
  React.useEffect(() => {
    if (chatFrom) {
      // workaround to make sure chat is being shown; (it was not showing on Android devices during tests)
      navigation.setParams({ chatFrom: undefined });
      openChat(chatFrom.id, chatFrom.agent);
    }
  }, [navigation, chatFrom, openChat]);
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
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        {order.dispatchingState === 'going-pickup' ||
        order.dispatchingState === 'arrived-pickup' ? (
          <DeliveryProblemCard
            title={t('Desistir da entrega')}
            subtitle={t('Atenção: só é possível desistir até o momento da retirada')}
            onPress={refuseDeliveryHandler}
            situation="drop"
          />
        ) : null}
        {order.status === 'dispatching' ? (
          <DeliveryProblemCard
            title={t('Tive um problema com o pedido')}
            subtitle={t('Se você já estiver com o pedido em mãos e teve um problema')}
            onPress={deliveryProblemHandler}
            situation="problem"
          />
        ) : null}
        <TouchableOpacity
          style={{ marginBottom: padding }}
          onPress={() => openChatWithRestaurant()}
        >
          <HomeCard
            icon={<IconProblemChat />}
            title={t('Preciso falar com o restaurante')}
            subtitle={t('Abrir chat direto com o restaurante')}
          />
        </TouchableOpacity>
        {/* commented for now. will be added back later */}
        {/* <TouchableOpacity onPress={() => navigation.navigate('CallCourier')}>
          <HomeCard
            icon={<IconProblemUrgent />}
            title={t('Estou com o problema urgente')}
            subtitle={t('O AppJusto vai ligar para você')}
          />
        </TouchableOpacity> */}
      </PaddedView>
    </ScrollView>
  );
};

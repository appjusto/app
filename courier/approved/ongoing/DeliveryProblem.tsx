import { Flavor, IssueType } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Linking, ScrollView, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
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
  // tracking
  useSegmentScreen('DeliveryProblem');
  //handlers
  const openChatWithRestaurant = React.useCallback(
    (delayed?: boolean) => {
      track('courier opening chat with restaurant');
      openChat(businessId!, 'business', delayed);
    },
    [openChat, businessId]
  );
  const navigateToAction = (issueType: IssueType, orderId: string) => {
    navigation.navigate('ReportIssue', {
      issueType,
      orderId,
    });
  };
  const refuseDeliveryHandler = () => {
    if (!order) return;
    if (order.type === 'food') {
      navigation.replace('CourierDropsOrder', {
        issueType: 'courier-drops-food-delivery',
        orderId,
      });
    } else {
      navigation.replace('CourierDropsOrder', {
        issueType: 'courier-drops-p2p-delivery',
        orderId,
      });
    }
  };

  const deliveryProblemHandler = () => {
    if (!order) return;
    if (order.type === 'food') {
      if (
        order.dispatchingState === 'going-pickup' ||
        order.dispatchingState === 'arrived-pickup'
      ) {
        navigateToAction('courier-pickup-food-delivery', orderId);
      } else if (order.dispatchingState === 'going-destination') {
        navigateToAction('courier-delivering-food-order', orderId);
      } else if (order.dispatchingState === 'arrived-destination') {
        navigateToAction('courier-destination-food', orderId);
      }
    } else if (order.type === 'p2p') {
      if (
        order.dispatchingState === 'going-pickup' ||
        order.dispatchingState === 'arrived-pickup'
      ) {
        navigateToAction('courier-pickup-p2p-delivery', orderId);
      } else if (order.dispatchingState === 'going-destination') {
        navigateToAction('courier-delivering-p2p-order', orderId);
      } else if (order.dispatchingState === 'arrived-destination') {
        navigateToAction('courier-destination-p2p', orderId);
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
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
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
        <DeliveryProblemCard
          title={t('Tive um problema com o pedido')}
          subtitle={t('Se você já estiver com o pedido em mãos e teve um problema')}
          onPress={deliveryProblemHandler}
          situation="courier-problem"
        />
        <DeliveryProblemCard
          title={t('Preciso falar com o restaurante')}
          subtitle={t('Abrir chat direto com o restaurante')}
          onPress={() => openChatWithRestaurant()}
          situation="chat"
        />
        {/* open whatsapp chat */}
        <DeliveryProblemCard
          title={t('Preciso falar com o AppJusto')}
          subtitle={t('Abrir chat no WhatsApp')}
          onPress={() => {
            track('opening appJusto whatsapp');
            Linking.openURL(AppJustoAssistanceWhatsAppURL);
          }}
          situation="chat"
        />
        {/* commented for now. will be added back later */}
        {/* <DeliveryProblemCard
          title={t('Estou com o problema urgente')}
          subtitle={t('O AppJusto vai ligar para você')}
          onPress={() => null}
          situation="urgent"
        /> */}
      </PaddedView>
    </ScrollView>
  );
};

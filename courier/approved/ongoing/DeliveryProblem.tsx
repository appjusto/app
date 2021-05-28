import { Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconProblemCancel } from '../../../common/icons/icon-problem-cancel';
import { IconProblemChat } from '../../../common/icons/icon-problem-chat';
import { IconProblemPack } from '../../../common/icons/icon-problem-pack';
import { IconProblemUrgent } from '../../../common/icons/icon-problem-urgent';
import HomeCard from '../../../common/screens/home/cards/HomeCard';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
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
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
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
    if (order.dispatchingState === 'going-pickup') {
      navigation.navigate('ReportIssue', { issueType: 'courier-refuse', orderId });
    } else {
      dispatch(showToast(t('Só é possível desistir até o momento da retirada'), 'error'));
    }
  };
  const deliveryProblemHandler = () => {
    if (!order) return;
    if (order.dispatchingState === 'going-pickup') {
      dispatch(
        showToast(t('Você precisa estar com o pedido em mãos para relatar um problema.'), 'error')
      );
    } else {
      navigation.navigate('ReportIssue', {
        issueType: 'courier-delivery-problem',
        orderId,
      });
    }
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
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        <TouchableOpacity style={{ marginBottom: padding }} onPress={refuseDeliveryHandler}>
          <HomeCard
            icon={<IconProblemCancel />}
            title={t('Desistir da entrega')}
            subtitle={t('Atenção: só é possível desistir até o momento da retirada')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginBottom: padding }} onPress={deliveryProblemHandler}>
          <HomeCard
            icon={<IconProblemPack />}
            title={t('Tive um problema com o pedido')}
            subtitle={t('Se você já estiver com o pedido em mãos e teve um problema')}
          />
        </TouchableOpacity>
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
        <TouchableOpacity>
          <HomeCard
            icon={<IconProblemUrgent />}
            title={t('Estou com o problema urgente')}
            subtitle={t('O AppJusto vai ligar para você')}
          />
        </TouchableOpacity>
      </PaddedView>
    </ScrollView>
  );
};

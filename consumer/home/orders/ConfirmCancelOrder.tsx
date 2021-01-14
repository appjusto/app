import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'ConfirmCancelOrder'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'ConfirmCancelOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // app state
  const busy = useSelector(getUIBusy);
  // screen state
  const { order } = useObserveOrder(orderId);
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  const cancellationCharge =
    order.status === 'dispatching' &&
    (order.dispatchingState === 'going-destination' ||
      order.dispatchingState === 'arrived-destination');
  const description = cancellationCharge
    ? t('Como seu pedido já está a caminho do local de entrega, você não será reembolsado.')
    : t('Como seu pedido ainda não foi pegue, você não será cobrado pelo cancelamento.');
  return (
    <FeedbackView
      header={t('Tem certeza que deseja cancelar o pedido?')}
      description={description}
      icon={icons.coneYellow}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <DefaultButton
          title={t('Cancelar pedido')}
          onPress={() => navigation.navigate('CancelOrder', { orderId })}
          activityIndicator={busy}
          disabled={busy}
        />
        <DefaultButton
          style={{
            marginBottom: padding,
          }}
          title={t('Não cancelar')}
          onPress={() => navigation.pop()}
          secondary
        />
      </View>
    </FeedbackView>
  );
};

import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { colors, halfPadding, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirmCancel'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderConfirmCancel'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderConfirmCancel = ({ navigation, route }: Props) => {
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
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  const cancellationCharge =
    order.type === 'food'
      ? order.status === 'confirmed'
      : order.dispatchingState === 'going-destination' ||
        order.dispatchingState === 'arrived-destination';
  const description = cancellationCharge
    ? t('Seu pedido já foi iniciado e algumas taxas podem ser cobradas.')
    : t('Como seu pedido ainda não foi retirado, você não será cobrado pelo cancelamento.');
  return (
    <View style={{ ...screens.default }}>
      <FeedbackView
        header={t('Tem certeza que deseja cancelar?')}
        description={description}
        icon={<Image source={icons.coneYellow} />}
      />
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
          alignItems: 'center',
          marginBottom: padding,
          justifyContent: 'space-between',
          paddingHorizontal: padding,
        }}
      >
        <View style={{ flex: 7 }}>
          <DefaultButton
            title={t('Cancelar pedido')}
            onPress={() => navigation.navigate('OngoingOrderCanceled', { orderId })}
            activityIndicator={busy}
            disabled={busy}
          />
        </View>
        <View style={{ marginLeft: halfPadding, flex: 7 }}>
          <DefaultButton title={t('Não cancelar')} onPress={() => navigation.pop()} secondary />
        </View>
      </View>
    </View>
  );
};

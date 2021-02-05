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
import { borders, colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { OrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'OrderMatching'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<OrderNavigatorParamList, 'OrderMatching'>;

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

  // side effects
  React.useEffect(() => {
    if (order?.status === 'canceled') {
      navigation.popToTop();
    } else if (order?.status === 'dispatching') {
      navigation.replace('OngoingOrder', {
        orderId,
      });
    } else if (order?.dispatchingState === 'unmatched') {
      navigation.navigate('OrderUnmatched', { orderId });
    }
  }, [order]);

  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  return (
    <FeedbackView
      header={t('Procurando entregadores...')}
      description={t('A cobrança só será efetuada caso um entregador aceitar o seu pedido.')}
      icon={icons.motocycle}
    >
      <DefaultButton
        title={t('Cancelar pedido')}
        onPress={() => navigation.navigate('ConfirmCancelOrder', { orderId })}
        activityIndicator={busy}
        disabled={busy}
        style={{
          ...borders.default,
          marginBottom: padding,
          borderColor: colors.black,
          backgroundColor: 'white',
        }}
      />
      <DefaultButton title={t('Voltar para o início')} onPress={() => navigation.popToTop()} />
      {/* testing the new screen */}
      {/* <DefaultButton
        title={t('Nenhum entregador')}
        onPress={() => navigation.navigate('OrderUnmatched', { orderId })}
      /> */}
    </FeedbackView>
  );
};

import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { padding } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderNoMatch'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderNoMatch'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderNoMatch = ({ navigation, route }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // params
  const { orderId } = route.params ?? {};
  // state
  const [isLoading, setLoading] = React.useState(false);
  const order = useObserveOrder(orderId);
  // side effects
  React.useEffect(() => {
    if (!order) return;
    if (order.dispatchingStatus === 'matched' || order.dispatchingStatus === 'outsourced') {
      navigation.replace('OngoingOrder', { orderId });
    }
  }, [order, orderId, navigation]);
  // handlers
  const tryAgainHandler = async () => {
    track('clicked to try to find a courier to the order again');
    try {
      setLoading(true);
      await api.order().updateOrder(orderId, { dispatchingStatus: 'matching' });
      navigation.replace('OngoingOrder', { orderId });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(
        'Error while trying to update order.dispatchingStatus from no-match to matching again'
      );
      Sentry.Native.captureException(error);
    }
  };
  //tracking
  useSegmentScreen('OrderNoMatch');
  // UI
  return (
    <FeedbackView
      header={t('Sem entregadores/as\n na região :(')}
      description={t(
        'Infelizmente não encontramos nenhum/a entregador/a disponível. Tente novamente mais tarde.'
      )}
      icon={<IconConeYellow />}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: padding,
        }}
      >
        <View style={{ width: '49%' }}>
          <DefaultButton
            title={t('Tentar novamente')}
            onPress={tryAgainHandler}
            activityIndicator={isLoading}
            disabled={isLoading}
            secondary
          />
        </View>

        <View style={{ width: '49%' }}>
          <DefaultButton
            title={t('Cancelar pedido')}
            onPress={() => {
              navigation.navigate('OngoingOrderConfirmCancel', { orderId });
            }}
            activityIndicator={isLoading}
            disabled={isLoading}
            secondary
          />
        </View>
      </View>
      <DefaultButton
        title={t('Voltar para o início')}
        onPress={() => {
          navigation.replace('MainNavigator', { screen: 'Home' });
        }}
      />
    </FeedbackView>
  );
};

import { Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { CourierDeliveryInfo } from '../components/CourierDeliveryInfo';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryCode } from './OngoingDeliveryCode';
import { OngoingDeliveryInfo } from './OngoingDeliveryInfo';
import { OngoingDeliveryMap } from './OngoingDeliveryMap';
import { StatusControl } from './StatusControl';
import { OngoingDeliveryNavigatorParamList } from './types';
import { WithdrawOrderModal } from './WithdrawOrderModal';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'OngoingDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'OngoingDelivery'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const order = useObserveOrder(orderId);
  const [code, setCode] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const consumerId = order?.consumer.id;
  const businessId = order?.business?.id;
  // side effects
  // tracking
  useSegmentScreen('Ongoing Delivery');
  // keeping screen awake
  useKeepAwake();
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
  const openChatWithConsumer = React.useCallback(
    (delayed?: boolean) => openChat(consumerId!, 'consumer', delayed),
    [openChat, consumerId]
  );
  const openChatWithRestaurant = React.useCallback(
    (delayed?: boolean) => openChat(businessId!, 'business', delayed),
    [openChat, businessId]
  );
  // whenever params updates
  // open chat if there's a new message
  React.useEffect(() => {
    if (route.params.chatFrom) {
      navigation.setParams({ chatFrom: undefined });
      openChat(route.params.chatFrom.id, route.params.chatFrom.agent, true);
    }
  }, [route.params, navigation, openChat]);
  // whenever order updates
  // check status to navigate to other screens
  React.useEffect(() => {
    if (order?.status === 'delivered') {
      navigation.replace('DeliveryCompleted', { orderId, fee: order.fare!.courier.value });
    } else if (order?.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
    }
  }, [order, navigation, orderId]);
  // UI
  if (!order?.dispatchingState) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // UI handlers
  const nextDispatchingStateHandler = () => {
    (async () => {
      setLoading(true);
      try {
        if (order.dispatchingState === 'arrived-destination') {
          Keyboard.dismiss();
          await api.order().completeDelivery(orderId, code);
          setLoading(false);
        } else {
          await api.order().nextDispatchingState(orderId);
          if (order.dispatchingState === 'going-pickup' && order.type === 'food') {
            setModalOpen(true);
          }
          setTimeout(() => {
            setLoading(false);
          }, 5000);
        }
      } catch (error) {
        setLoading(false);
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  const codeDeliveryHandler = () => {
    (async () => {
      setLoading(true);
      try {
        await api.order().completeDelivery(orderId, code);
        setLoading(false);
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
        setLoading(false);
      }
    })();
  };
  // UI
  const { type, dispatchingState, status } = order;
  const nextStepDisabled =
    isLoading ||
    (type === 'food' && dispatchingState === 'arrived-pickup' && status !== 'dispatching');
  const nextStepLabel = (() => {
    const dispatchingState = order?.dispatchingState;
    if (!dispatchingState || dispatchingState === 'going-pickup') {
      return t('Cheguei para Retirada');
    } else if (dispatchingState === 'arrived-pickup') {
      return t('Saí para Entrega');
    } else if (dispatchingState === 'going-destination') {
      return t('Cheguei para entrega');
    } else if (dispatchingState === 'arrived-destination') {
      return t('Confirmar entrega');
    }
    return '';
  })();
  const sliderColor = (() => {
    if (!dispatchingState || dispatchingState === 'going-pickup') {
      return colors.green500;
    } else return colors.darkYellow;
  })();
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.default }}
      keyboardShouldPersistTaps="never"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* top*/}
        <CourierDeliveryInfo
          order={order}
          onChat={() => openChatWithConsumer()}
          onProblem={() => navigation.navigate('DeliveryProblem', { orderId })}
        />
        {/* center*/}
        <OngoingDeliveryMap order={order} onOpenChat={(from) => openChat(from.id, from.agent)} />
        {/* bottom*/}
        <OngoingDeliveryInfo
          order={order}
          onProblem={() => navigation.navigate('DeliveryProblem', { orderId })}
        />
        {/* Status slider */}
        {dispatchingState !== 'arrived-destination' ? (
          <View style={{ paddingHorizontal: padding }}>
            <StatusControl
              key={dispatchingState}
              style={{ marginBottom: padding }}
              text={nextStepLabel}
              disabled={nextStepDisabled}
              isLoading={isLoading}
              onConfirm={nextDispatchingStateHandler}
              color={sliderColor}
            />
          </View>
        ) : null}
        {/* code input */}
        <OngoingDeliveryCode
          code={code}
          onSetCode={setCode}
          buttonTitle={t('Confirmar entrega')}
          onDelivery={codeDeliveryHandler}
          isLoading={isLoading}
          onNoCodeDelivery={() => navigation.navigate('NoCodeDelivery', { orderId })}
          dispatchingState={dispatchingState}
        />
        {/* withdrawal modal */}
        <WithdrawOrderModal
          visible={modalOpen}
          order={order}
          onWithdrawal={() => {
            setModalOpen(false);
            nextDispatchingStateHandler();
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

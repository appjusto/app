import { Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useOrderBlockCourierNextStep } from '../../../common/store/api/order/hooks/useOrderBlockCourierNextStep';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { CourierDeliveryInfo } from '../components/CourierDeliveryInfo';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryCode } from './OngoingDeliveryCode';
import { OngoingDeliveryInfo } from './OngoingDeliveryInfo';
import { OngoingDeliveryLoading } from './OngoingDeliveryLoading';
import { OngoingDeliveryMap } from './OngoingDeliveryMap';
import { OngoingDeliverySlider } from './OngoingDeliverySlider';
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
  // redux
  const order = useObserveOrder(orderId);
  const consumerId = order?.consumer.id;
  const businessId = order?.business?.id;
  const dispatchingState = order?.dispatchingState;
  // screen state
  const [code, setCode] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [previousDispatchingState, setPreviousDispatchingState] = React.useState(dispatchingState);
  // helpers
  const shouldBlockNextStep = useOrderBlockCourierNextStep(orderId);
  console.log('shouldBlockNextStep', shouldBlockNextStep);
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
    (delayed?: boolean) => {
      track('courier opening chat with consumer');
      openChat(consumerId!, 'consumer', delayed);
    },
    [openChat, consumerId]
  );
  const openChatWithRestaurant = React.useCallback(
    (delayed?: boolean) => {
      track('courier opening chat with restaurant');
      openChat(businessId!, 'business', delayed);
    },
    [openChat, businessId]
  );
  // side effects
  // tracking
  useSegmentScreen('OngoingDelivery');
  // keeping screen awake
  useKeepAwake();
  // modal
  React.useEffect(() => {
    if (previousDispatchingState !== dispatchingState) {
      if (dispatchingState === 'arrived-pickup') {
        setModalOpen(true);
      }
      setPreviousDispatchingState(dispatchingState);
    }
  }, [dispatchingState, previousDispatchingState]);
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
    if (order === undefined) return;
    if (order === null) {
      navigation.replace('OrderNull');
    } else if (order.status === 'delivered') {
      navigation.replace('DeliveryCompleted', { orderId, fee: order.fare!.courier.value });
    } else if (order.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
    }
  }, [order, navigation, orderId]);
  // UI
  if (!order) {
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
      try {
        setLoading(true);
        if (dispatchingState === 'arrived-destination') {
          Keyboard.dismiss();
          await api.order().completeDelivery(orderId, code);
          track('courier completed delivery');
        } else {
          await api.order().nextDispatchingState(orderId);
        }
      } catch (error: any) {
        dispatch(showToast(error.toString(), 'error'));
      } finally {
        setLoading(false);
      }
    })();
  };
  const codeDeliveryHandler = () => {
    Keyboard.dismiss();
    (async () => {
      setLoading(true);
      try {
        await api.order().completeDelivery(orderId, code);
        setLoading(false);
      } catch (error: any) {
        dispatch(showToast(error.toString(), 'error'));
        setLoading(false);
      }
    })();
  };
  const navigateToDeliveryProblem = () => {
    navigation.navigate('DeliveryProblem', { orderId });
  };
  // UI
  const { type } = order;
  // const nextStepDisabled =
  //   isLoading || (type === 'food' && previousDispatchingState === 'arrived-pickup');
  const nextStepDisabled = isLoading || shouldBlockNextStep;
  const nextStepLabel = (() => {
    const dispatchingState = order?.dispatchingState;
    if (!dispatchingState || dispatchingState === 'going-pickup') {
      return t('Cheguei');
    } else if (dispatchingState === 'arrived-pickup') {
      return t('Sair para a Entrega');
    } else if (dispatchingState === 'going-destination') {
      return t('Entreguei');
    } else if (dispatchingState === 'arrived-destination') {
      return t('Finalizar');
    }
    return '';
  })();
  const sliderColor = (() => {
    if (!previousDispatchingState || previousDispatchingState === 'going-pickup') {
      return colors.green500;
    } else return colors.darkYellow;
  })();
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.default }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* top*/}
        <CourierDeliveryInfo
          order={order}
          onChat={() => openChatWithConsumer()}
          onProblem={navigateToDeliveryProblem}
        />
        {/* center*/}
        <OngoingDeliveryMap
          order={order}
          onOpenChat={(from) => openChat(from.id, from.agent)}
          isLoading={!dispatchingState}
        />
        {/* bottom*/}
        <OngoingDeliveryInfo order={order} onProblem={navigateToDeliveryProblem} />
        <OngoingDeliveryLoading dispatchingState={previousDispatchingState} />
        {/* Status slider */}
        <OngoingDeliverySlider
          order={order}
          text={nextStepLabel}
          onReceiveOrder={() => setModalOpen(true)}
          disabled={nextStepDisabled}
          isLoading={isLoading}
          onConfirm={nextDispatchingStateHandler}
          sliderColor={sliderColor}
        />
        {/* chat with restaurant */}
        {type === 'food' && previousDispatchingState ? (
          <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
            <DefaultButton
              title={t('Abrir chat com o restaurante')}
              onPress={() => openChatWithRestaurant()}
              secondary
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
          onNoCodeDelivery={() => {
            navigation.navigate('NoCodeDelivery', { orderId });
          }}
          dispatchingState={previousDispatchingState}
        />
        {/* withdrawal modal */}
        <WithdrawOrderModal
          visible={modalOpen}
          order={order}
          onWithdrawal={() => {
            nextDispatchingStateHandler();
            setModalOpen(false);
          }}
          onIssue={() => {
            navigateToDeliveryProblem();
            setModalOpen(false);
          }}
          onModalClose={() => setModalOpen(false)}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

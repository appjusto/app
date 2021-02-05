import { Feather } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import { CourierDistanceBadge } from '../../../common/screens/orders/ongoing/CourierDistanceBadge';
import CourierStatusHighlight from '../../../common/screens/orders/ongoing/CourierStatusHighlight';
import { courierNextPlace } from '../../../common/store/api/order/helpers';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import OrderMap from '../../../consumer/home/orders/p2p-order/OrderMap';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { RouteIcons } from './RouteIcons';
import { OngoingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingParamList, 'OngoingDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingParamList, 'OngoingDelivery'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { orderId, newMessage } = route.params;
  // context
  const api = React.useContext(ApiContext);
  // screen state
  const { order } = useObserveOrder(orderId);
  const { mutate: nextDispatchingState, isLoading: isUpdatingDispatchingState } = useMutation(() =>
    api.order().nextDispatchingState(orderId)
  );
  const { mutate: completeDelivery, isLoading: isCompletingDelivery } = useMutation(() =>
    api.order().completeDelivery(orderId)
  );
  const isLoading = isUpdatingDispatchingState || isCompletingDelivery;
  // side effects
  // whenever params updates
  // open chat if there's a new message
  React.useEffect(() => {
    console.log('OngoingDelivery, newMessage:', newMessage);
    if (newMessage) {
      // workaround to make sure chat is being shown; (it was not showing on Android devices during tests)
      setTimeout(() => {
        navigation.setParams({ newMessage: false });
        navigation.navigate('Chat', { orderId });
      }, 100);
    }
  }, [newMessage]);
  // whenever order updates
  // check status to navigate to other screens
  React.useEffect(() => {
    if (order?.status === 'delivered') {
      navigation.replace('DeliveryCompleted', { orderId, fee: order.fare!.courierFee });
    } else if (order?.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
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

  // UI handlers
  // handles updating dispatchingState
  const nextStatepHandler = () => {
    if (order.dispatchingState !== 'arrived-destination') {
      nextDispatchingState();
    } else {
      completeDelivery();
    }
  };
  const nextStepLabel = (() => {
    const dispatchingState = order?.dispatchingState;
    if (dispatchingState === 'going-pickup') {
      return t('Cheguei para Retirada');
    } else if (dispatchingState === 'arrived-pickup') {
      return t('Saí para Entrega');
    } else if (dispatchingState === 'going-destination') {
      return t('Cheguei para entrega');
    } else if (dispatchingState === 'arrived-destination') {
      return t('Finalizar entrega');
    }
    return '';
  })();
  const nextPlace = courierNextPlace(order);
  const { dispatchingState } = order;
  const addressLabel = (() => {
    if (dispatchingState === 'going-pickup' || dispatchingState === 'going-destination') {
      return t('Retirada em');
    } else if (
      dispatchingState === 'arrived-pickup' ||
      dispatchingState === 'arrived-destination'
    ) {
      return t('Entrega em');
    }
    return '';
  })();

  return (
    <View style={{ ...screens.default, paddingBottom: padding }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order!} />
        <RouteIcons order={order} />
        <CourierStatusHighlight dispatchingState={dispatchingState} />
      </View>
      <View style={{ marginTop: padding, paddingHorizontal: padding }}>
        <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Pedido de')}</Text>
        <Text style={[texts.medium]}>
          {!isEmpty(order.consumer.name) ? order.consumer.name : t('Cliente')}
        </Text>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: padding }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { orderId })}>
            <View style={{ marginTop: halfPadding }}>
              <RoundedText
                leftIcon={<Feather name="message-circle" size={12} style={{ marginRight: 6 }} />}
              >
                {t('Iniciar chat')}
              </RoundedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CourierDeliveryProblem', { orderId })}
          >
            <View style={{ marginTop: halfPadding }}>
              <RoundedText
                color={colors.red}
                leftIcon={
                  <Feather name="info" size={12} color={colors.red} style={{ marginRight: 6 }} />
                }
              >
                {t('Tive um problema')}
              </RoundedText>
            </View>
          </TouchableOpacity>
        </View>
        <HR />
      </View>
      <View
        style={{
          paddingHorizontal: padding,
          flexDirection: 'row',
          marginTop: padding,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={[texts.small, { color: colors.darkGreen }]}>{addressLabel}</Text>
          <Text style={[texts.small]}>{nextPlace?.address.main}</Text>
        </View>
        <View>
          <CourierDistanceBadge order={order} />
        </View>
      </View>
      <View style={{ marginTop: padding, paddingHorizontal: padding }}>
        {/* Slider */}
        {/* <StatusControl status={nextStepLabel} nextStepHandler={nextStatepHandler} /> */}
        <DefaultButton
          title={nextStepLabel}
          onPress={nextStatepHandler}
          activityIndicator={isLoading}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

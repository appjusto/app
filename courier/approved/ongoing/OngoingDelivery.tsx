import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { distance } from 'geokit';
import { isEmpty, round } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMutation } from 'react-query';
import * as icons from '../../../assets/icons';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import ShowIf from '../../../common/components/views/ShowIf';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../../../common/utils/formatters';
import CourierStatusHighlight from '../../../consumer/home/orders/CourierStatusHighlight';
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
  //updates components whenever the dispatchingState changes
  const { dispatchingState } = order;
  const { courierWaiting, addressLabel, address, dispatchDetails } = (() => {
    let courierWaiting = null;
    let addressLabel = '';
    let address = '';
    let dispatchDetails = '';
    if (dispatchingState === 'going-pickup') {
      addressLabel = t('Retirada em');
      address = order.origin.address.main;
      dispatchDetails = separateWithDot(
        formatDistance(
          round(
            distance(
              { lat: order.courier!.location.latitude, lng: order.courier!.location.longitude },
              { lat: order.origin.location!.latitude, lng: order.origin.location!.longitude }
            ),
            2
          ) * 1000
        ),
        formatDuration(order.route?.duration)
      );
    } else if (dispatchingState === 'arrived-pickup') {
      addressLabel = t('Retirada em');
      address = order.origin.address.main;
      dispatchDetails = t('Chegou no local');
      courierWaiting = {
        title: t('Aguardando para retirada'),
        message: t('Confirme sua saída somente após receber o pedido'),
      };
    } else if (dispatchingState === 'going-destination') {
      addressLabel = t('Entrega em');
      address = order.destination.address.main;
      dispatchDetails = `Distância até a entrega: ${formatDistance(
        round(
          distance(
            { lat: order.courier!.location.latitude, lng: order.courier!.location.longitude },
            {
              lat: order.destination!.location!.latitude,
              lng: order.destination!.location!.longitude,
            }
          ),
          2
        ) * 1000
      )}`;
    } else if (dispatchingState === 'arrived-destination') {
      addressLabel = t('Entrega em');
      address = order.destination.address.main;
      dispatchDetails = t('Chegou no local');
      courierWaiting = {
        title: t('Aguardando para entrega'),
        message: t('Finalize o pedido somente após realizar a entrega'),
      };
    }
    return { courierWaiting, addressLabel, address, dispatchDetails };
  })();

  return (
    <View style={{ ...screens.default, paddingBottom: padding }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order!} />
        <RouteIcons order={order} />
        <View style={{ paddingHorizontal: padding }}>
          <ShowIf test={!!courierWaiting}>
            {() => (
              <CourierStatusHighlight
                title={courierWaiting!.title}
                subtitle={courierWaiting!.message}
              />
            )}
          </ShowIf>
        </View>
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
              <RoundedText leftIcon={icons.chat}>{t('Iniciar chat')}</RoundedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CourierDeliveryProblem', { orderId })}
          >
            <View style={{ marginTop: halfPadding }}>
              <RoundedText color={colors.red} leftIcon={icons.infoRed}>
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
          <Text style={[texts.small]}>{address}</Text>
        </View>
        <View>
          <RoundedText backgroundColor={colors.lightGrey} color={colors.darkGrey} noBorder>
            {dispatchDetails}
          </RoundedText>
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

import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import ShowIf from '../../../common/components/views/ShowIf';
import { completeDelivery, nextDispatchingState } from '../../../common/store/order/actions';
import { getOrderById } from '../../../common/store/order/selectors';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, halfPadding, screens, texts } from '../../../common/styles';
import OrderMap from '../../../consumer/home/orders/p2p-order/OrderMap';
import PlaceSummary from '../../../consumer/home/orders/p2p-order/PlaceSummary';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
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
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { orderId } = route.params;

  // app state
  const busy = useSelector(getUIBusy);
  const order = useSelector(getOrderById)(orderId);
  const dispatchingState = order?.dispatchingState;
  const originLatitude = order?.origin.location?.latitude;
  const originLongitude = order?.origin.location?.longitude;
  const destinationLatitude = order?.destination.location?.latitude;
  const destinationLongitude = order?.destination.location?.longitude;

  // side effects
  // whenever params updates
  useEffect(() => {
    const { newMessage } = route.params ?? {};
    console.log(route.params);
    if (newMessage) {
      // this may be necessary to avoid keeping this indefinitely
      // navigation.setParams({ newMessage: false });
      // Workaround to make sure chat is being shown; (it was not showing on Android devices during tests)
      setTimeout(() => {
        openChatHandler();
      }, 100);
    }
  }, [route.params]);
  // whenever order updates
  useEffect(() => {
    if (order?.status === 'delivered') {
      navigation.replace('DeliveryCompleted', { orderId, fee: order.fare!.courierFee });
    } else if (order?.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
    }
  }, [order]);

  // handlers
  // handles delivery dispatching updates
  const nextStatepHandler = useCallback(async () => {
    if (dispatchingState !== 'arrived-destination') {
      dispatch(nextDispatchingState(api)(order.id));
    } else {
      dispatch(completeDelivery(api)(order.id));
    }
  }, [order, dispatchingState]);
  // handles opening chat screen
  const openChatHandler = useCallback(() => {
    navigation.navigate('Chat', { orderId });
  }, []);
  // handles opening cancel confirmation screen
  const cancelHandler = useCallback(() => {
    navigation.navigate('CancelOngoingDelivery', { orderId });
  }, []);

  const openGoogleMapsRouteHandler = () => {
    if (dispatchingState === 'going-pickup') {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${originLatitude},${originLongitude}&dir_action=navigate`
      );
    } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'going-destination') {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${destinationLatitude},${destinationLongitude}&dir_action=navigate`
      );
    } else if (dispatchingState === 'arrived-destination') {
      Linking.openURL(`https://www.google.com/maps/search/?api=1`);
    }
  };

  const openWazeRouteHandler = () => {
    if (dispatchingState === 'going-pickup') {
      Linking.openURL(
        `https://www.waze.com/ul?ll=${originLatitude}%2C${originLongitude}&navigate=yes&zoom=17`
      );
    } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'going-destination') {
      Linking.openURL(
        `https://www.waze.com/ul?ll=${destinationLatitude}%2C${destinationLongitude}&navigate=yes&zoom=17`
      );
    } else if (dispatchingState === 'arrived-destination') {
      Linking.openURL(`https://waze.com/ul`);
    }
  };

  // UI
  const nextStepLabel = useMemo(() => {
    if (dispatchingState === 'going-pickup') {
      return t('Cheguei para Retirada');
    } else if (dispatchingState === 'arrived-pickup') {
      return t('Sai para Entrega');
    } else if (dispatchingState === 'going-destination') {
      return t('Cheguei para entrega');
    } else if (dispatchingState === 'arrived-destination') {
      return t('Finalizar entrega');
    }
    return '';
  }, [dispatchingState]);

  const RouteIcons = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        top: halfPadding,
        right: halfPadding,
      }}
    >
      <TouchableOpacity onPress={openGoogleMapsRouteHandler}>
        <View
          style={{
            height: 48,
            width: 48,
            ...borders.default,
            borderRadius: 24,
            borderColor: colors.lightGrey,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white,
          }}
        >
          <Image source={icons.googleMaps} height={29} width={29} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={openWazeRouteHandler}>
        <View
          style={{
            height: 48,
            width: 48,
            ...borders.default,
            borderRadius: 24,
            borderColor: colors.lightGrey,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: halfPadding,
            backgroundColor: colors.white,
          }}
        >
          <Image source={icons.waze} height={32} width={29} />
        </View>
      </TouchableOpacity>
    </View>
  );

  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <View style={{ ...screens.default }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order!} />
        <RouteIcons />
      </View>
      <PaddedView style={{ backgroundColor: colors.lightGrey }}>
        <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Pedido de')}</Text>
        <Text style={[texts.medium]}>
          {!isEmpty(order.consumer.name) ? order.consumer.name : t('Cliente')}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={openChatHandler}>
            <View style={{ marginTop: halfPadding }}>
              <RoundedText leftIcon={icons.chat}>{t('Iniciar chat')}</RoundedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelHandler}>
            <View style={{ marginTop: halfPadding }}>
              <RoundedText color={colors.red} leftIcon={icons.reject}>
                {t('Cancelar Corrida')}
              </RoundedText>
            </View>
          </TouchableOpacity>
        </View>
      </PaddedView>
      <PaddedView>
        <ShowIf test={dispatchingState === 'going-pickup' || dispatchingState === 'arrived-pickup'}>
          {() => <PlaceSummary place={order.origin} title={t('Retirada')} />}
        </ShowIf>
        <ShowIf
          test={
            dispatchingState === 'going-destination' || dispatchingState === 'arrived-destination'
          }
        >
          {() => <PlaceSummary place={order.destination} title={t('Entrega')} />}
        </ShowIf>

        <View style={{ marginTop: halfPadding }}>
          {/* Slider */}
          {/* <StatusControl status={nextStepLabel} nextStepHandler={nextStatepHandler} /> */}
          <DefaultButton
            title={nextStepLabel}
            onPress={nextStatepHandler}
            activityIndicator={busy}
            disabled={busy}
          />
        </View>
      </PaddedView>
    </View>
  );
}

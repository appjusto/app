import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import ShowIf from '../../../common/components/views/ShowIf';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { completeDelivery, nextDispatchingState } from '../../../common/store/order/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, halfPadding, screens, texts } from '../../../common/styles';
import OrderMap from '../../../consumer/home/orders/p2p-order/OrderMap';
import PlaceSummary from '../../../consumer/home/orders/p2p-order/PlaceSummary';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { getNavigationLinkTo, NavigationApp } from './navigation';
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
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const busy = useSelector(getUIBusy);
  // screen state
  const { order } = useObserveOrder(orderId);
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
      dispatch(nextDispatchingState(api)(orderId));
    } else {
      dispatch(completeDelivery(api)(orderId));
    }
  };
  // handles opening chat screen
  const routeHandler = (app: NavigationApp) => {
    const dispatchingState = order?.dispatchingState;
    let location = undefined;
    if (dispatchingState === 'going-pickup') {
      location = order?.origin.location;
    } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'going-destination') {
      location = order?.destination.location;
    }
    Linking.openURL(getNavigationLinkTo(app, location));
  };
  const nextStepLabel = (() => {
    const dispatchingState = order?.dispatchingState;
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
  })();

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
      <TouchableOpacity onPress={() => routeHandler('google-maps')}>
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
      <TouchableOpacity onPress={() => routeHandler('waze')}>
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
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { orderId })}>
            <View style={{ marginTop: halfPadding }}>
              <RoundedText leftIcon={icons.chat}>{t('Iniciar chat')}</RoundedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CancelOngoingDelivery', { orderId })}
          >
            <View style={{ marginTop: halfPadding }}>
              <RoundedText color={colors.red} leftIcon={icons.reject}>
                {t('Cancelar Corrida')}
              </RoundedText>
            </View>
          </TouchableOpacity>
        </View>
      </PaddedView>
      <PaddedView>
        <ShowIf
          test={
            order.dispatchingState === 'going-pickup' || order.dispatchingState === 'arrived-pickup'
          }
        >
          {() => <PlaceSummary place={order.origin} title={t('Retirada')} />}
        </ShowIf>
        <ShowIf
          test={
            order.dispatchingState === 'going-destination' ||
            order.dispatchingState === 'arrived-destination'
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

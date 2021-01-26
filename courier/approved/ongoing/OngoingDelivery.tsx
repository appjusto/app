import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMutation } from 'react-query';
import * as icons from '../../../assets/icons';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import ShowIf from '../../../common/components/views/ShowIf';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../../../common/utils/formatters';
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
    <View style={{ ...screens.default, paddingBottom: padding }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order!} />
        <RouteIcons />
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
      <View style={{ paddingHorizontal: padding }}>
        <ShowIf
          test={
            order.dispatchingState === 'going-pickup' || order.dispatchingState === 'arrived-pickup'
          }
        >
          {() => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <PlaceSummary place={order.origin} title={t('Retirada')} />
                <Text style={{ ...texts.small }}>{order.destination?.address.secondary}</Text>
              </View>
              <View>
                <RoundedText backgroundColor={colors.lightGrey} color={colors.darkGrey}>
                  {separateWithDot(
                    formatDistance(order.route?.distance),
                    formatDuration(order.route?.duration)
                  )}
                </RoundedText>
              </View>
            </View>
          )}
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
            activityIndicator={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
}

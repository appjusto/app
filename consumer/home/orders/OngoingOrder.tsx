import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { distance } from 'geokit';
import { round } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { ProfileIcon } from '../../../common/components/icons/RoundedIcon';
import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import { getOrderById } from '../../../common/store/order/selectors';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';
import OrderMap from './p2p-order/OrderMap';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'OngoingOrder'>;
type ScreenRoute = RouteProp<HomeNavigatorParamList, 'OngoingOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const { orderId } = route.params;

  // app state
  const order = useSelector(getOrderById)(orderId)!;
  const { dispatchingState } = order;

  // effects
  useEffect(() => {
    if (order.status === 'delivered') {
      navigation.replace('OrderDeliveredFeedback', { orderId });
    }
  }, [order]);

  useEffect(() => {
    const { newMessage } = route.params ?? {};
    if (newMessage) {
      openChatHandler();
    }
  }, [route.params]);

  // handlers
  const openChatHandler = useCallback(() => {
    navigation.navigate('Chat', { orderId });
  }, [order]);

  // UI
  const { courierWaiting, addressLabel, address, dispatchDetails } = useMemo(() => {
    let courierWaiting = null;
    let addressLabel = '';
    let address = '';
    let dispatchDetails = '';
    if (dispatchingState === 'going-pickup') {
      addressLabel = t('Retirada em');
      address = order.origin.address.main;
      dispatchDetails = `Distância até a retirada: ${round(
        distance(
          { lat: order.courier!.location.latitude, lng: order.courier!.location.longitude },
          { lat: order.origin.location.latitude, lng: order.origin.location.longitude }
        ),
        2
      )}km`;
    } else if (dispatchingState === 'arrived-pickup') {
      addressLabel = t('Retirada em');
      address = order.origin.address.main;
      dispatchDetails = t('Entregador no local');
      courierWaiting = {
        title: t('Entregador chegou ao local'),
        message: t('Aguardando para retirada'),
      };
    } else if (dispatchingState === 'going-destination') {
      addressLabel = t('Entrega em');
      address = order.destination.address.main;
      dispatchDetails = `Distância até a entrega: ${round(
        distance(
          { lat: order.courier!.location.latitude, lng: order.courier!.location.longitude },
          { lat: order.destination.location.latitude, lng: order.destination.location.longitude }
        ),
        2
      )}km`;
    } else if (dispatchingState === 'arrived-destination') {
      addressLabel = t('Entrega em');
      address = order.destination.address.main;
      dispatchDetails = t('Entregador no local');
      courierWaiting = {
        title: t('Entregador chegou ao local'),
        message: t('Aguardando para entrega'),
      };
    }
    return { courierWaiting, addressLabel, address, dispatchDetails };
  }, [order, dispatchingState]);
  return (
    <View style={{ ...screens.default }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order} />
      </View>
      <PaddedView style={{ backgroundColor: colors.white, flexDirection: 'row' }}>
        <ProfileIcon />
        <View style={{ flex: 1, marginLeft: padding }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[texts.medium]}>{order.courier!.name}</Text>
            <RoundedText>{dispatchDetails}</RoundedText>
          </View>
          <Text style={[texts.small, { color: colors.lightGreen }]}>{addressLabel}</Text>
          <Text style={[texts.small]}>{address}</Text>
        </View>
      </PaddedView>
      <HR />
      <PaddedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 7 }}>
          <DefaultButton title={t('Iniciar chat')} onPress={openChatHandler} />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 7 }}>
          <DefaultButton
            style={{ backgroundColor: colors.white, ...borders.default }}
            title={t('Mais informações')}
            onPress={() => navigation.navigate('CourierDetail', { courierId: order.courier!.id })}
          />
        </View>
      </PaddedView>
    </View>
  );
}

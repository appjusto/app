import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { distance } from 'geokit';
import { round } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { ProfileIcon } from '../../../common/components/icons/RoundedIcon';
import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import ShowIf from '../../../common/components/views/ShowIf';
import useNotificationToken from '../../../common/hooks/useNotificationToken';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { getOrderById } from '../../../common/store/order/selectors';
import { updateProfile } from '../../../common/store/user/actions';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';
import CourierStatusHighlight from './CourierStatusHighlight';
import OrderMap from './p2p-order/OrderMap';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'OngoingOrder'>;
type ScreenRoute = RouteProp<HomeNavigatorParamList, 'OngoingOrder'>;

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
  const consumer = useSelector(getConsumer);
  const order = useSelector(getOrderById)(orderId)!;
  const { dispatchingState } = order;

  // state
  const [notificationToken, shouldDeleteToken, shouldUpdateToken] = useNotificationToken(
    consumer!.notificationToken
  );

  // side effects
  // whenever params changes
  useEffect(() => {
    const { newMessage } = route.params ?? {};
    if (newMessage) {
      openChatHandler();
    }
  }, [route.params]);
  // whenever notification token needs to be updated
  useEffect(() => {
    if (shouldDeleteToken || shouldUpdateToken) {
      const token = shouldUpdateToken ? notificationToken : null;
      dispatch(updateProfile(api)(consumer!.id, { notificationToken: token }));
    }
  }, [consumer, notificationToken, shouldDeleteToken, shouldUpdateToken]);
  // whenever order changes
  useEffect(() => {
    if (order.status === 'delivered') {
      navigation.replace('OrderDeliveredFeedback', { orderId });
    }
  }, [order]);

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
        <ShowIf test={!!courierWaiting}>
          {() => (
            <CourierStatusHighlight
              title={courierWaiting!.title}
              subtitle={courierWaiting!.message}
            />
          )}
        </ShowIf>
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
            onPress={() =>
              navigation.navigate('CourierDetail', {
                orderId,
                fleet: order.fare!.fleet,
              })
            }
          />
        </View>
      </PaddedView>
    </View>
  );
}

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { distance } from 'geokit';
import { round } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import ShowIf from '../../../common/components/views/ShowIf';
import useNotificationToken from '../../../common/hooks/useNotificationToken';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { updateProfile } from '../../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import CourierStatusHighlight from './CourierStatusHighlight';
import OrderMap from './p2p-order/OrderMap';
import { OrderNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OrderNavigatorParamList, 'OngoingOrder'>;
type ScreenRoute = RouteProp<OrderNavigatorParamList, 'OngoingOrder'>;

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
  const consumer = useSelector(getConsumer);
  // screen state
  const { order } = useObserveOrder(orderId);
  const [notificationToken, shouldDeleteToken, shouldUpdateToken] = useNotificationToken(
    consumer!.notificationToken
  );
  // side effects
  // whenever params changes
  // open chat if there's a new message
  React.useEffect(() => {
    console.log('OngoingOrder, newMessage:', newMessage);
    if (newMessage) {
      setTimeout(() => {
        navigation.setParams({ newMessage: false });
        navigation.navigate('Chat', { orderId });
      }, 100);
    }
  }, [newMessage]);
  // whenever notification token needs to be updated
  React.useEffect(() => {
    if (shouldDeleteToken || shouldUpdateToken) {
      const token = shouldUpdateToken ? notificationToken : null;
      dispatch(updateProfile(api)(consumer!.id, { notificationToken: token }));
    }
  }, [notificationToken, shouldDeleteToken, shouldUpdateToken]);
  // whenever order changes
  // check status to navigate to other screens
  React.useEffect(() => {
    if (order?.status === 'delivered') {
      navigation.replace('OrderDeliveredFeedback', { orderId });
    } else if (order?.dispatchingState === 'matching') {
      // happens when courier cancels the delivery
      navigation.replace('OrderMatching', { orderId });
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
      dispatchDetails = t('Entregador no local');
      courierWaiting = {
        title: t('Entregador chegou ao local'),
        message: t('Aguardando para retirada'),
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
      dispatchDetails = t('Entregador no local');
      courierWaiting = {
        title: t('Entregador chegou ao local'),
        message: t('Aguardando para entrega'),
      };
    }
    return { courierWaiting, addressLabel, address, dispatchDetails };
  })();
  return (
    <View style={{ ...screens.default }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order} />
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
      <PaddedView style={{ backgroundColor: colors.white, flexDirection: 'row' }}>
        <RoundedProfileImg flavor="courier" id={order.courier!.id} />
        <View style={{ flex: 1, marginLeft: padding }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[texts.medium]}>{order.courier!.name}</Text>
            <RoundedText backgroundColor={colors.lightGrey} color={colors.darkGrey} noBorder>
              {dispatchDetails}
            </RoundedText>
          </View>
          <Text style={[texts.small, { color: colors.darkGreen }]}>{addressLabel}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[texts.small]}>{address}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateOrderP2P', { orderId: order.id })}
            >
              <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Alterar rota')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PaddedView>
      <HR />
      <PaddedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 7 }}>
          <DefaultButton
            title={t('Abrir chat')}
            onPress={() => navigation.navigate('Chat', { orderId })}
          />
        </View>
        <View style={{ flex: 7, marginLeft: halfPadding }}>
          <DefaultButton
            title={t('Mais informações')}
            onPress={() =>
              navigation.navigate('CourierDetail', {
                orderId,
              })
            }
            secondary
          />
        </View>
      </PaddedView>
    </View>
  );
}

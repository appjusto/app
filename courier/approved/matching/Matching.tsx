import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import RoundedText from '../../../common/components/texts/RoundedText';
import { useObserveOrderRequest } from '../../../common/store/api/courier/hooks/useObserveOrderRequest';
import { screen, useSegmentScreen } from '../../../common/store/api/track';
import { getCourier } from '../../../common/store/courier/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import {
  formatCurrency,
  formatDistance,
  formatTime,
  separateWithDot,
} from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { AcceptControl } from './AcceptControl';
import { AddressCard } from './AddressCard';
import { MatchingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MatchingParamList, 'Matching'>,
  StackNavigationProp<ApprovedParamList, 'MatchingNavigator'>
>;
type ScreenRouteProp = RouteProp<MatchingParamList, 'Matching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { matchRequest } = route.params;
  const { orderId, origin, distanceToOrigin, originAddress, destinationAddress, type } =
    matchRequest;
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  const courier = useSelector(getCourier)!;
  // state
  const request = useObserveOrderRequest(courier.id, orderId);
  const situation = request?.situation;
  const canAccept = situation === 'pending' || situation === 'viewed';
  const [distance, setDistance] = React.useState(distanceToOrigin);
  const [isLoading, setLoading] = React.useState(true);
  // side effects
  // calculating the real distance between courier and origin
  React.useEffect(() => {
    (async () => {
      try {
        const position = await Location.getCurrentPositionAsync();
        const currentDistanceToOrigin = await api
          .maps()
          .googleRouteAndDistance(position.coords, origin);
        if (currentDistanceToOrigin) setDistance(currentDistanceToOrigin.distance);
        screen('Matching', {
          orderId,
          distanceToOrigin,
          currentDistanceToOrigin,
        });
      } catch (error) {
        dispatch(
          showToast(
            t('Não foi possível obter sua localização atual. Verifque suas configurações.'),
            'error'
          )
        );
        Sentry.Native.captureException(error);
      }
      setLoading(false);
    })();
  }, [distanceToOrigin, orderId, origin, api, dispatch]);
  // when situation changes
  React.useEffect(() => {
    if (situation === 'pending') {
      api.courier().viewOrderRequest(courier.id, orderId);
    } else if (situation === 'accepted') {
      navigation.replace('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId,
        },
      });
    } else if (situation === 'expired') {
      navigation.replace('MatchingError');
    } else if (situation === 'rejected') {
      navigation.popToTop();
    }
  }, [situation, orderId, courier.id, api, navigation]);
  // tracking
  useSegmentScreen('Matching');
  // UI
  if (isLoading)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  // UI handlers
  const acceptHandler = async () => {
    try {
      setLoading(true);
      await api.order().matchOrder(orderId);
    } catch (error) {
      navigation.replace('MatchingError');
    }
  };
  const rejectHandler = () => {
    navigation.replace('RejectedMatching', { orderId });
  };
  // UI
  return (
    <ScrollView
      style={[screens.default]}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ paddingHorizontal: padding, paddingVertical: 24, flex: 1 }}>
        <View
          style={{
            width: '100%',
            height: 54,
            backgroundColor: colors.green50,
            borderRadius: 64,
            padding,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ marginRight: halfPadding, ...texts.md }}>
            {String.fromCodePoint(0x1f389)}
          </Text>
          <Text style={{ ...texts.md, color: colors.grey700 }}>{t('Nova corrida disponível')}</Text>
        </View>
        <View
          style={{
            marginTop: 24,
            width: '100%',
            height: 64,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ ...texts.md, color: colors.grey700, textAlign: 'center' }}>
              {t('Você recebe')}
            </Text>
            <Text style={{ ...texts.x4l, textAlign: 'center' }}>
              {formatCurrency(matchRequest.fee)}
            </Text>
          </View>
          <View
            style={{
              height: '100%',
              borderLeftColor: colors.grey500,
              borderLeftWidth: 1,
              borderStyle: 'solid',
            }}
          />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ ...texts.md, color: colors.grey700, textAlign: 'center' }}>
              {t('Distância total')}
            </Text>
            {/* distance between origin and destination plus distance between courier's position and origin */}
            <Text style={{ ...texts.x4l, textAlign: 'center' }}>
              {formatDistance(matchRequest.distance + distance)}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          {matchRequest.readyAt ? (
            <RoundedText color={colors.white} backgroundColor={colors.black}>
              {separateWithDot(
                `${t('Previsão de preparo: ')}`,
                formatTime(new Date(matchRequest.readyAt))
              )}
            </RoundedText>
          ) : type === 'food' ? (
            <RoundedText color={colors.white} backgroundColor={colors.black}>
              {t('Pedido pronto')}
            </RoundedText>
          ) : null}
        </View>
        <View style={{ flex: 1 }} />
        {/* origin */}
        <View style={{ marginBottom: halfPadding }}>
          <AddressCard kind="origin" distance={formatDistance(distance)} address={originAddress} />
        </View>
        {/* destination */}
        <View>
          <AddressCard
            kind="destination"
            distance={`+ ${formatDistance(matchRequest.distance)}`} // distance between origin and destination
            address={destinationAddress}
          />
        </View>
        <View style={{ flex: 1 }} />
        {/* slider accept/reject control */}
        {canAccept ? (
          <View>
            <AcceptControl
              onAccept={acceptHandler}
              onReject={rejectHandler}
              style={{
                marginBottom: padding,
                paddingHorizontal: padding,
              }}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

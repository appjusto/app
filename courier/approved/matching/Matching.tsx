import { LatLng } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { round } from 'lodash';
import React from 'react';
import { ActivityIndicator, Keyboard, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import useLastKnownLocation from '../../../common/location/useLastKnownLocation';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { useObserveOrderRequests } from '../../../common/store/api/courier/hooks/useObserveOrderRequests';
import { screen } from '../../../common/store/api/track';
import { getCourier } from '../../../common/store/courier/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency, formatDistance, formatTime } from '../../../common/utils/formatters';
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
  const {
    orderId,
    origin,
    distanceToOrigin,
    originAddress,
    destinationAddress,
    type,
    destination,
  } = matchRequest;
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  const courier = useSelector(getCourier)!;
  const tallerDevice = useTallerDevice();
  // state
  const { coords, lastKnownLocation } = useLastKnownLocation();
  const request = useObserveOrderRequests(orderId)?.find(() => true);
  const situation = request?.situation;
  console.log(request?.id);
  const canAccept = situation === 'pending' || situation === 'viewed';
  const [routeDistanceToOrigin, setRouteDistanceToOrigin] = React.useState<number>();
  const [isLoading, setLoading] = React.useState(true);
  const [courierLatLng, setCourierLatLng] = React.useState<LatLng>();
  // side effects
  // calculating the real distance between courier and origin
  React.useEffect(() => {
    (async () => {
      try {
        // const position = await Location.getCurrentPositionAsync();
        // settting courierLatLng for the map
        if (coords) {
          setCourierLatLng({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          const currentDistanceToOrigin = await api
            .maps()
            .googleDirections(coords, origin, courier.mode);
          if (currentDistanceToOrigin) {
            setRouteDistanceToOrigin(currentDistanceToOrigin.distance);
            screen('Matching', {
              orderId,
              distanceToOrigin,
              currentDistanceToOrigin,
            });
            setLoading(false);
          }
        } else {
          screen('Matching', {
            orderId,
            distanceToOrigin,
          });
        }
      } catch (error) {
        setLoading(false);
        setRouteDistanceToOrigin(distanceToOrigin);
        Keyboard.dismiss();
        dispatch(
          showToast(
            t('Não foi possível obter sua localização atual. Verifque suas configurações.'),
            'error'
          )
        );
        Sentry.Native.captureException(error);
      }
    })();
  }, [
    distanceToOrigin,
    orderId,
    origin,
    api,
    dispatch,
    courier.mode,
    destinationAddress,
    lastKnownLocation,
    coords,
  ]);
  // when situation changes
  React.useEffect(() => {
    if (situation === 'pending') {
      api.courier().viewOrderRequest(request!.id);
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
  }, [situation, request, orderId, courier.id, api, navigation]);
  // UI handlers
  const acceptHandler = async () => {
    try {
      setLoading(true);
      await api.order().matchOrder(orderId, routeDistanceToOrigin);
    } catch (error) {
      console.log(error);
      navigation.replace('MatchingError');
    }
  };
  const rejectHandler = () => {
    console.log('chamando rejectHandler');
    navigation.replace('RejectedMatching', { orderId });
  };
  // UI
  if (isLoading || routeDistanceToOrigin === undefined) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // helpers
  const totalDistance = (matchRequest.distance + routeDistanceToOrigin) / 1000;
  const fee = matchRequest.netValue + (matchRequest?.locationFee ?? 0);
  const feePerKm = fee / 100 / totalDistance;
  const roundedFeePerKm = round(feePerKm, 2);
  return (
    <ScrollView
      style={[screens.default, screens.headless]}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ paddingVertical: padding, flex: 1 }}>
        {request?.fleetName ? (
          <PaddedView
            style={{
              backgroundColor: colors.grey50,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: padding,
              marginTop: padding,
            }}
          >
            <Text style={{ ...texts.md, ...texts.bold, marginBottom: 4 }}>
              {`Frota ${request.fleetName}`}
            </Text>
            {request.locationFee ? (
              <View>
                <RoundedText
                  backgroundColor={colors.yellow}
                  leftIcon={<MaterialIcons name="trending-up" size={20} />}
                >
                  {`Alta demanda + ${formatCurrency(request.locationFee)}`}
                </RoundedText>
              </View>
            ) : null}
          </PaddedView>
        ) : (
          <View
            style={{
              backgroundColor: colors.grey50,
              borderRadius: 64,
              padding,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: padding,
              marginHorizontal: padding,
            }}
          >
            <Text style={{ marginRight: halfPadding, ...texts.md }}>
              {String.fromCodePoint(0x1f389)}
            </Text>
            <Text style={{ ...texts.md, color: colors.grey700 }}>
              {t('Nova corrida disponível')}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <View
          style={{
            marginTop: padding,
            width: '100%',
            height: 64,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: padding,
          }}
        >
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ ...texts.x4l, textAlign: 'center' }}>{formatCurrency(fee)}</Text>
            <Text
              style={{
                ...texts.xs,
                color: colors.grey700,
                textAlign: 'center',
              }}
            >
              R$ {roundedFeePerKm} por Km
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
            <Text style={{ ...texts.x4l, textAlign: 'center' }}>
              {formatDistance(matchRequest.distance + routeDistanceToOrigin)}
            </Text>
            <Text
              style={{
                ...texts.xs,
                color: colors.grey700,
                textAlign: 'center',
              }}
            >
              {t('Distância total')}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ alignItems: 'center', paddingHorizontal: padding, paddingTop: padding }}>
          {matchRequest.readyAt ? (
            <RoundedText color={colors.white} backgroundColor={colors.black}>
              {`${t('Pedido pronto às')} ${formatTime(new Date(matchRequest.readyAt))}`}
            </RoundedText>
          ) : type === 'food' ? (
            <RoundedText color={colors.white} backgroundColor={colors.black}>
              {t('Pedido pronto')}
            </RoundedText>
          ) : null}
        </View>
        <View style={{ flex: 1 }} />
        {/* map */}
        <View
          style={{
            marginTop: padding,
            ...borders.default,
            marginHorizontal: padding,
            borderRadius: padding,
            overflow: 'hidden',
            paddingBottom: padding,
          }}
        >
          <OrderMap
            originLocation={origin}
            destinationLocation={destination}
            courierLocation={courierLatLng}
            ratio={360 / 160}
            mapWidth="100%"
            mapHeigth={tallerDevice ? 180 : 120}
          />
          <AddressCard
            kind="origin"
            distance={formatDistance(routeDistanceToOrigin)}
            address={originAddress}
          />
          <AddressCard
            kind="destination"
            distance={formatDistance(matchRequest.distance)} // distance between origin and destination
            address={destinationAddress}
          />
        </View>
        <View style={{ flex: 1 }} />
        {/* slider accept/reject control */}
        {canAccept ? (
          <View style={{ marginTop: padding, paddingHorizontal: padding }}>
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

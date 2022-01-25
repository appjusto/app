import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import RoundedText from '../../../common/components/texts/RoundedText';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { useObserveOrderRequest } from '../../../common/store/api/courier/hooks/useObserveOrderRequest';
import { distanceBetweenLatLng } from '../../../common/store/api/helpers';
import { screen, useSegmentScreen } from '../../../common/store/api/track';
import { getCourier } from '../../../common/store/courier/selectors';
import { showToast } from '../../../common/store/ui/actions';
import {
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../common/styles';
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
  const { orderId, origin, distanceToOrigin, originAddress, destinationAddress } = matchRequest;
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
  const [newLayout, setNewLayout] = React.useState(false);
  // side effects
  React.useEffect(() => {
    (async () => {
      try {
        const position = await Location.getCurrentPositionAsync();
        const currentDistanceToOrigin = distanceBetweenLatLng(position.coords, origin);
        setDistance(currentDistanceToOrigin);
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
  }, [distanceToOrigin, orderId, origin]);
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
  const tallerDevice = useTallerDevice();
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
  return newLayout ? (
    <ScrollView
      style={[screens.default]}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* header */}
        <View style={{ alignItems: 'center', backgroundColor: colors.green500 }}>
          <Text style={[texts.x2l, { marginTop: 40 }]}>{t('Nova corrida para você!')}</Text>
          <Text style={[texts.x40l, { marginBottom: 40 }]}>{formatCurrency(matchRequest.fee)}</Text>
          {matchRequest.readyAt ? (
            <RoundedText style={{ marginBottom: 40 }}>
              {formatTime(new Date(matchRequest.readyAt))}
            </RoundedText>
          ) : (
            <RoundedText style={{ marginBottom: 40 }}>{t('Pedido pronto')}</RoundedText>
          )}
        </View>
        {/* body */}
        <View style={{ paddingLeft: padding }}>
          {/* origin */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: doublePadding }}>
            <Image
              source={icons.pinPackageWhite}
              style={{ width: 32, height: 40, marginRight: padding }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[texts.sm, { color: colors.green600 }]}>{t('Retirada')}</Text>
              <View>
                <Text style={[texts.x2l]}>
                  {formatDistance(distance)} {t('até a retirada')}
                </Text>
                <Text style={[texts.md, { flexWrap: 'wrap', maxWidth: '80%' }]} numberOfLines={3}>
                  {matchRequest.originAddress}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: colors.black,
              marginLeft: padding,
              height: 32,
            }}
          />
          {/* destination */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.pinPackage}
              style={{ width: 32, height: 40, marginRight: padding }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[texts.sm, { color: colors.green600 }]}>{t('Entrega')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={[texts.x2l]}>
                  {formatDistance(matchRequest.distance)} {t('até a entrega')}
                </Text>
                <Text style={[texts.md, { flexWrap: 'wrap', maxWidth: '80%' }]} numberOfLines={3}>
                  {matchRequest.destinationAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        {/* accept / reject control */}
        {canAccept ? (
          <AcceptControl
            onAccept={acceptHandler}
            onReject={rejectHandler}
            style={{
              marginBottom: tallerDevice ? padding * 4 : padding,
              paddingHorizontal: padding,
            }}
          />
        ) : null}
      </View>
    </ScrollView>
  ) : (
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
            {/* TODO: calculate this distance/route "for real". we are using straight lines */}
            <Text style={{ ...texts.x4l, textAlign: 'center' }}>
              {formatDistance(matchRequest.distance)}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          {/*TODO: add the conditional:  matchRequest.readyAt ? show estimated time : show "order ready" */}
          <RoundedText color={colors.white} backgroundColor={colors.black}>
            {separateWithDot(`${t('Previsão de preparo: ')}`, `${t('20 min')}`)}
          </RoundedText>
          {/* <RoundedText color={colors.white} backgroundColor={colors.black}>
            {t('Pedido pronto')}
          </RoundedText> */}
        </View>
        <View style={{ flex: 1 }} />
        {/* origin */}
        <View style={{ marginBottom: halfPadding }}>
          <AddressCard
            kind="origin"
            distance={formatDistance(distanceToOrigin)} // TODO: calculate real distance. this is using a straight line
            address={originAddress}
          />
        </View>
        {/* destination */}
        <View>
          <AddressCard
            kind="destination"
            distance={`+ ${formatDistance(distance)}`} // distance between origin and destination
            address={destinationAddress}
          />
        </View>
        <View style={{ flex: 1 }} />
        {/* slider accept/reject control */}
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
      </View>
    </ScrollView>
  );
}

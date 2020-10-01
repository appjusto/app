import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useContext, useCallback } from 'react';
import { Text, View, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import { matchOrder } from '../../../common/store/order/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { texts, screens, colors, padding } from '../../../common/styles';
import { formatCurrency, formatDistance } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import AcceptControl from './AcceptControl';
import { MatchingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<MatchingParamList, 'Matching'>;
type ScreenRouteProp = RouteProp<MatchingParamList, 'Matching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { matchRequest } = route.params ?? {};

  // app state
  const busy = useSelector(getUIBusy);

  // handlers
  const acceptHandler = useCallback(async () => {
    try {
      // TODO: show feedback
      await dispatch(matchOrder(api)(matchRequest.orderId));
    } catch (error) {
      navigation.navigate('MatchingError');
    }
    // TODO: if successful, go to Delivering screen
  }, [matchRequest]);

  const rejectHandler = useCallback(() => {
    navigation.navigate('MatchingRefused');
  }, [matchRequest]);

  // side effects
  useEffect(() => {
    if (!matchRequest) navigation.goBack();
  }, []);

  // UI
  if (!matchRequest) return null;

  return (
    <PaddedView style={{ ...screens.default }}>
      {/* header */}
      <View style={{ alignItems: 'center' }}>
        <Text style={[texts.big, { color: colors.darkGreen }]}>{t('Nova corrida para você!')}</Text>
        <Text style={[texts.huge]}>{formatCurrency(matchRequest.courierFee)}</Text>
      </View>
      <View style={{ flex: 1 }} />
      {/* body */}
      <View>
        {/* distance to origin */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icons.transit} style={{ width: 32, height: 32, marginRight: padding }} />
          <Text style={[texts.medium]}>
            {formatDistance(matchRequest.distanceToOrigin)} {t('até a retirada')}
          </Text>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: colors.black,
            marginLeft: padding,
            height: 15,
          }}
        />
        {/* origin */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={icons.pinPackageWhite}
            style={{ width: 34, height: 44, marginRight: padding }}
          />
          <View style={{ flex: 1 }}>
            <Text style={[texts.default, { color: colors.darkGreen }]}>{t('Retirada')}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[texts.medium, { flexWrap: 'wrap' }]} numberOfLines={3}>
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
            height: 15,
          }}
        />
        {/* destination */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={icons.pinPackage}
            style={{ width: 34, height: 44, marginRight: padding }}
          />
          <View style={{ flex: 1 }}>
            <Text style={[texts.default, { color: colors.darkGreen }]}>{t('Entrega')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={[texts.medium, { flexWrap: 'wrap' }]} numberOfLines={3}>
                {matchRequest.destinationAddress}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: colors.black,
            marginLeft: padding,
            height: 15,
          }}
        />
        {/* total distance */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={icons.transitConclusion}
            style={{ width: 32, height: 32, marginRight: padding }}
          />
          <Text style={[texts.medium]}>
            {formatDistance(matchRequest.totalDistance)} {t('no percurso total')}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      {/* accept / reject control */}
      <AcceptControl acceptHandler={acceptHandler} rejectHandler={rejectHandler} disabled={busy} />
    </PaddedView>
  );
}

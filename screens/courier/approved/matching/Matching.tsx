import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useContext, useCallback } from 'react';
import { Text, View, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as icons from '../../../../assets/icons';
import { matchOrder } from '../../../../store/order/actions';
import { getUIBusy } from '../../../../store/ui/selectors';
import { t } from '../../../../strings';
import { formatDistance } from '../../../../utils/formatters';
import { ApiContext, AppDispatch } from '../../../app/context';
import { texts, screens, colors, padding } from '../../../common/styles';
import PaddedView from '../../../common/views/PaddedView';
import { ApprovedParamList } from '../types';
import AcceptControl from './AcceptControl';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'Matching'>;
type ScreenRouteProp = RouteProp<ApprovedParamList, 'Matching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  console.log('Matching!');
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { matchRequest } = route.params ?? {};

  // app state
  const busy = useSelector(getUIBusy);

  // handlers
  const acceptHandler = useCallback(async () => {
    try {
      await dispatch(matchOrder(api)(matchRequest.orderId));
    } catch (error) {
      navigation.navigate('MatchingFeedback');
    }
    // TODO: if successful, go to Delivering screen
  }, [matchRequest]);

  const rejectHandler = useCallback(() => {
    navigation.goBack();
    // TODO: ask why
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
        <Text style={[texts.huge]}>
          {t('R$')} {matchRequest.courierFee}
        </Text>
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

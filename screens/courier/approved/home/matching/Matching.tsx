import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Text, Button, View, Image } from 'react-native';

import { matchOrder } from '../../../../../store/order/actions';
import { t } from '../../../../../strings';
import { ApiContext } from '../../../../app/context';
import { texts, screens, colors, padding, borders } from '../../../../common/styles';
import { HomeParamList } from '../types';
import AcceptControl from './AcceptControl';
import PaddedView from '../../../../common/views/PaddedView';
import * as icons from '../../../../../assets/icons';

type ScreenNavigationProp = StackNavigationProp<HomeParamList, 'Matching'>;
type ScreenRouteProp = RouteProp<HomeParamList, 'Matching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  console.log('Matching!');
  // context
  const api = useContext(ApiContext);
  const { matchRequest } = route.params ?? {};

  // state
  const [waiting, setWaiting] = useState(false);

  // handlers
  const acceptHandler = useCallback(async () => {
    setWaiting(true);
    const match = await matchOrder(api)(matchRequest.orderId);
    setWaiting(false);
    console.log(match);
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
      <View style={{ flex: 1 }} />
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
            {`${matchRequest.distanceToOrigin}km`} {t('até a retirada')}
          </Text>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: colors.black,
            marginLeft: padding,
            height: 30,
          }}
        />
        {/* origin */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={icons.pinPackageWhite}
            style={{ width: 34, height: 44, marginRight: padding }}
          />
          <View>
            <Text style={[texts.default, { color: colors.darkGreen }]}>{t('Retirada')}</Text>
            <Text style={[texts.medium]}>{matchRequest.originAddress}</Text>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: colors.black,
            marginLeft: padding,
            height: 30,
          }}
        />
        {/* destination */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={icons.pinPackage}
            style={{ width: 34, height: 44, marginRight: padding }}
          />
          <View>
            <Text style={[texts.default, { color: colors.darkGreen }]}>{t('Entrega')}</Text>
            <Text style={[texts.medium]}>{matchRequest.destinationAddress}</Text>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: colors.black,
            marginLeft: padding,
            height: 30,
          }}
        />
        {/* total distance */}
        <View style={{ flexDirection: 'row' }}>
          <Image source={icons.transitConclusion} width={32} height={32} />
          <Text style={[texts.medium]}>
            {`${matchRequest.totalDistance}km`} {t('no percurso total')}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      {/* accept / reject control */}
      <AcceptControl
        acceptHandler={acceptHandler}
        rejectHandler={rejectHandler}
        disabled={waiting}
      />
      <View style={{ flex: 1 }} />
    </PaddedView>
  );
}

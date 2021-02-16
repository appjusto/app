import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import * as icons from '../../../assets/icons';
import { ApiContext } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, padding, screens, texts } from '../../../common/styles';
import { formatCurrency, formatDistance } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import AcceptControl from './AcceptControl';
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
  const { orderId } = matchRequest;
  // context
  const api = React.useContext(ApiContext);
  // screen state
  const [isLoading, setLoading] = React.useState(false);
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

      navigation.replace('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId,
        },
      });
    } catch (error) {
      navigation.replace('MatchingError');
    }
  };

  const rejectHandler = () => {
    navigation.replace('RefuseDelivery', { orderId });
  };

  return (
    <View style={[screens.default, screens.headless]}>
      <PaddedView style={{ flex: 1 }}>
        {/* header */}
        <View style={{ marginTop: padding, alignItems: 'center' }}>
          <Text style={[texts.xxl, { color: colors.green600 }]}>
            {t('Nova corrida para você!')}
          </Text>
          <Text style={[texts.xxxxl]}>{formatCurrency(matchRequest.courierFee)}</Text>
        </View>
        <View style={{ flex: 1 }} />
        {/* body */}
        <View>
          {/* distance to origin */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={icons.transit} style={{ width: 32, height: 32, marginRight: padding }} />
            <Text style={[texts.md]}>
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
              <Text style={[texts.sm, { color: colors.green600 }]}>{t('Retirada')}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[texts.md, { flexWrap: 'wrap' }]} numberOfLines={3}>
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
              <Text style={[texts.sm, { color: colors.green600 }]}>{t('Entrega')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={[texts.md, { flexWrap: 'wrap' }]} numberOfLines={3}>
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
            <Text style={[texts.md]}>
              {formatDistance(matchRequest.totalDistance)} {t('no percurso total')}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        {/* accept / reject control */}
        <AcceptControl
          acceptHandler={acceptHandler}
          rejectHandler={rejectHandler}
          disabled={isLoading}
        />
      </PaddedView>
    </View>
  );
}

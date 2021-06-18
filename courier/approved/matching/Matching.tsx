import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import * as icons from '../../../assets/icons';
import { ApiContext } from '../../../common/app/context';
import RoundedText from '../../../common/components/texts/RoundedText';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, doublePadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency, formatDistance, formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { AcceptControl } from './AcceptControl';
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
  // side effects
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
      setLoading(false);
      navigation.replace('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId,
        },
      });
    } catch (error) {
      setLoading(false);
      navigation.replace('MatchingError');
    }
  };
  const rejectHandler = () => {
    // using this until backend is published again with the new issueType
    navigation.replace('RefuseDelivery', { orderId, issueType: 'courier-drops-delivery' });
    // navigation.replace('RefuseDelivery', { orderId, issueType: 'courier-rejects-matching' });
  };
  // UI
  return (
    <ScrollView style={[screens.default]} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        {/* header */}
        <View style={{ alignItems: 'center', backgroundColor: colors.green500 }}>
          <Text style={[texts.x2l, { marginTop: 40 }]}>{t('Nova corrida para você!')}</Text>
          <Text style={[texts.x40l, { marginBottom: 40 }]}>{formatCurrency(matchRequest.fee)}</Text>
          {matchRequest.readyAt && formatTime(matchRequest.readyAt) ? (
            <RoundedText style={{ marginBottom: 40 }}>
              {formatTime(matchRequest.readyAt)!}
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
                  {formatDistance(matchRequest.distanceToOrigin)} {t('até a retirada')}
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
                  {formatDistance(matchRequest.distance)} {t('no percurso total')}
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
        <AcceptControl
          onAccept={acceptHandler}
          onReject={rejectHandler}
          style={{ marginBottom: tallerDevice ? padding * 4 : padding, paddingHorizontal: padding }}
        />
      </View>
    </ScrollView>
  );
}

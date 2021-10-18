import { MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import RoundedText from '../../../common/components/texts/RoundedText';
import ConfigItem from '../../../common/components/views/ConfigItem';
import { useobservePendingOrderRequests } from '../../../common/store/api/courier/hooks/useobservePendingOrderRequests';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { getCourier } from '../../../common/store/courier/selectors';
import { screens } from '../../../common/styles';
import { formatCurrency, formatDistance } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { MatchingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MatchingParamList, 'OrderRequests'>,
  StackNavigationProp<ApprovedParamList, 'MatchingNavigator'>
>;
type ScreenRouteProp = RouteProp<MatchingParamList, 'OrderRequests'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const courier = useSelector(getCourier)!;
  // state
  const requests = useobservePendingOrderRequests(courier.id);
  // tracking
  useSegmentScreen('OrderRequests');
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => (
          <ConfigItem
            leftIcon={
              item.type === 'food' ? (
                <MaterialIcons name="fastfood" size={16} />
              ) : (
                <MaterialIcons name="local-mall" size={16} />
              )
            }
            title={formatCurrency(item.fee)}
            subtitle={`${formatDistance(item.distance)} ${t('de percurso')}`}
            onPress={() => {
              track('navigating to Matching');
              navigation.navigate('MatchingNavigator', {
                screen: 'Matching',
                params: {
                  matchRequest: item,
                },
              });
            }}
          >
            <RoundedText>{`${formatDistance(item.distanceToOrigin)} ${t(
              'até a retirada'
            )}`}</RoundedText>
          </ConfigItem>
        )}
      />
    </View>
  );
}

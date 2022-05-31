import { MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import RoundedText from '../../../common/components/texts/RoundedText';
import ConfigItem from '../../../common/components/views/ConfigItem';
import { useobservePendingOrderRequests } from '../../../common/store/api/courier/hooks/useobservePendingOrderRequests';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getCourier } from '../../../common/store/courier/selectors';
import { screens } from '../../../common/styles';
import { formatCurrency, formatDistance } from '../../../common/utils/formatters';
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
        renderItem={({ item }) => {
          const street = item.originAddress.split(',').shift();
          const neighboorhood = item.originAddress.split('-')[1].split(',').shift();
          const originAddress = street ? `${street},${neighboorhood ?? ''}` : '';
          return (
            <ConfigItem
              leftIcon={
                item.type === 'food' ? (
                  <MaterialIcons name="fastfood" size={16} />
                ) : (
                  <MaterialIcons name="local-mall" size={16} />
                )
              }
              title={formatCurrency(item.fee)}
              subtitle={originAddress}
              onPress={() => {
                navigation.navigate('MatchingNavigator', {
                  screen: 'Matching',
                  params: {
                    matchRequest: item,
                  },
                });
              }}
            >
              <RoundedText>{`Percurso total: ${formatDistance(
                item.distanceToOrigin + item.distance
              )}`}</RoundedText>
            </ConfigItem>
          );
        }}
      />
    </View>
  );
}

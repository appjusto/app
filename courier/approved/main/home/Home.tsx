import { CourierStatus } from '@appjusto/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MaintenanceModal } from '../../../../common/components/views/MaintenanceModal';
import { UpgradeVersionModal } from '../../../../common/components/views/UpgradeVersionModal';
import { useNotificationToken } from '../../../../common/hooks/useNotificationToken';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { getCourier } from '../../../../common/store/courier/selectors';
import { screens } from '../../../../common/styles';
import {
  startLocationUpdatesTask,
  stopLocationUpdatesTask,
} from '../../../../common/utils/location';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';
import HomeControls from './HomeControls';
import { LocationDisclosureModal } from './LocationDisclosureModal';
import { CourierHomeCardList } from './cards/CourierHomeCardList';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainParamList, 'Home'>,
  StackNavigationProp<ApprovedParamList, 'MainNavigator'>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // redux store
  const courier = useSelector(getCourier)!;
  const { status } = courier;
  const working = status !== undefined && status !== ('unavailable' as CourierStatus);
  // state
  const { shouldVerifyPhone } = useProfileSummary();

  // side effects
  useNotificationToken();
  // tracking
  useSegmentScreen('Home');
  // phone verification
  React.useEffect(() => {
    if (working && shouldVerifyPhone && courier.phone) {
      navigation.navigate('ProfileNavigator', {
        screen: 'PhoneVerificationScreen',
        params: {
          phone: courier.phone,
          countryCode: courier.countryCode,
        },
      });
    }
  }, [working, shouldVerifyPhone, courier.phone]);
  // location
  React.useEffect(() => {
    (async () => {
      if (working) {
        await startLocationUpdatesTask();
      } else {
        await stopLocationUpdatesTask();
      }
    })();
  }, [working]);
  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <HomeControls
          onFleetDetail={() => {
            navigation.navigate('ProfileNavigator', {
              screen: 'ChooseFleet',
            });
          }}
        />
        <View>
          <CourierHomeCardList
            onViewRequestsPress={() => {
              navigation.navigate('MatchingNavigator', {
                screen: 'OrderRequests',
              });
            }}
            onOngoingOrderPress={(order, chatFrom) => {
              navigation.navigate('OngoingDeliveryNavigator', {
                screen: 'OngoingDelivery',
                params: { orderId: order.id, chatFrom },
              });
            }}
            onDeliveriesSummaryPress={() => {
              navigation.navigate('MainNavigator', { screen: 'DeliveryHistory' });
            }}
            onHowItworksPress={() => {
              navigation.navigate('HowAppJustoWorksNavigator', { screen: 'HowAppJustoWorks' });
            }}
            onNeedSupportPress={() => {}}
            onRecommendBusinessPress={() => navigation.navigate('RecommendRestaurant')}
          />
          <MaintenanceModal />
          <UpgradeVersionModal />
        </View>
      </ScrollView>
      <LocationDisclosureModal />
    </View>
  );
}

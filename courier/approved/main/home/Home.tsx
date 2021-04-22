import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourierStatus } from 'appjusto-types';
import { LOCATION, usePermissions } from 'expo-permissions';
import { nanoid } from 'nanoid/non-secure';
import React, { useContext, useEffect } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import useLocationUpdates from '../../../../common/hooks/useLocationUpdates';
import useNotificationToken from '../../../../common/hooks/useNotificationToken';
import HomeOngoingDeliveries from '../../../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { getCourier } from '../../../../common/store/courier/selectors';
import { getOrders } from '../../../../common/store/order/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { borders, padding, screens } from '../../../../common/styles';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';
import { FreshWorksCard } from './FreshWorksCard';
import HomeControls from './HomeControls';
import HomeDeliveriesSummary from './HomeDeliveriesSummary';
import { LocationDisclosureModal } from './LocationDisclosureModal';
import ModalChooser from './ModalChooser';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainParamList, 'Home'>,
  StackNavigationProp<ApprovedParamList, 'MainNavigator'>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const courier = useSelector(getCourier)!;
  const { status } = courier;
  const ongoingOrders = useSelector(getOrders);
  const working = status !== undefined && status !== ('unavailable' as CourierStatus);
  // state
  const [locationPermission] = usePermissions(LOCATION);
  const [locationKey] = React.useState(nanoid());
  useLocationUpdates(locationPermission?.status === 'granted' && working, locationKey);
  const [notificationToken, shouldDeleteToken, shouldUpdateToken] = useNotificationToken(
    courier!.notificationToken
  );
  // side effects
  // tracking
  useSegmentScreen('Home');
  // notification permission
  useEffect(() => {
    if (shouldDeleteToken || shouldUpdateToken) {
      const token = shouldUpdateToken ? notificationToken : null;
      dispatch(updateProfile(api)(courier.id, { notificationToken: token }));
    }
  }, [notificationToken, shouldDeleteToken, shouldUpdateToken]);

  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView>
        <HomeControls
          onFleetDetail={() =>
            navigation.navigate('ProfileNavigator', {
              screen: 'ChooseFleet',
              params: {
                fleetId: courier.fleet!.id,
              },
            })
          }
        />
        <PaddedView>
          <HomeOngoingDeliveries
            orders={ongoingOrders}
            onSelect={(order, openChat) =>
              navigation.navigate('OngoingDeliveryNavigator', {
                screen: 'OngoingDelivery',
                params: { orderId: order.id, newMessage: openChat },
              })
            }
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('MainNavigator', { screen: 'DeliveryHistory' })}
          >
            <HomeDeliveriesSummary />
          </TouchableOpacity>
          <View style={{ marginVertical: padding }}>
            <FreshWorksCard
              onPress={() =>
                Linking.openURL(
                  'https://appjusto.freshdesk.com/support/solutions/folders/67000533349'
                )
              }
            />
          </View>
          <View style={{ marginTop: padding }}>
            <TouchableOpacity
              style={{ ...borders.default, height: 32 }}
              onPress={() =>
                navigation.navigate('DeliveriesNavigator', { screen: 'ProfileSubmitted' })
              }
            >
              <Text>IR PARA PROFILESUBMITTED</Text>
            </TouchableOpacity>
            {/* <View>
              <DemandCard />
            </View> */}
          </View>
          <View style={{ marginBottom: padding }}>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Compartilhe esse movimento por uma economia mais justa."
            />
          </View>
          <ModalChooser />
        </PaddedView>
      </ScrollView>
      <LocationDisclosureModal />
    </View>
  );
}

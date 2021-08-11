import { CourierStatus } from '@appjusto/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../common/components/containers/PaddedView';
import useNotificationToken from '../../../../common/hooks/useNotificationToken';
import { IconHomeCourierRequests } from '../../../../common/icons/icon-home-courier-requests';
import { IconPartners } from '../../../../common/icons/icon-partners';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import HomeOngoingDeliveries from '../../../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { useobservePendingOrderRequests } from '../../../../common/store/api/courier/hooks/useobservePendingOrderRequests';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { getCourier } from '../../../../common/store/courier/selectors';
import { getOrders } from '../../../../common/store/order/selectors';
import { colors, padding, screens } from '../../../../common/styles';
import {
  startLocationUpdatesTask,
  stopLocationUpdatesTask,
} from '../../../../common/utils/location';
import { t } from '../../../../strings';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';
import { FreshDeskCard } from './FreshDeskCard';
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
  // redux store
  const courier = useSelector(getCourier)!;
  const ongoingOrders = useSelector(getOrders);
  const { status } = courier;
  const working = status !== undefined && status !== ('unavailable' as CourierStatus);
  // state
  const requests = useobservePendingOrderRequests(courier.id);
  // side effects
  useNotificationToken();
  // tracking
  useSegmentScreen('Home');
  React.useEffect(() => {
    if (working) {
      startLocationUpdatesTask();
    } else {
      stopLocationUpdatesTask();
    }
  }, [working]);
  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
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
          {requests.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MatchingNavigator', {
                  screen: 'OrderRequests',
                })
              }
            >
              <View style={{ marginVertical: padding }}>
                <HomeCard
                  icon={<IconHomeCourierRequests />}
                  title={t('Novos pedidos disponíveis')}
                  subtitle={t('Existe pedidos que você pode aceitar agora mesmo!')}
                  bgColor={colors.yellow}
                  borderColor={colors.black}
                />
              </View>
            </TouchableOpacity>
          ) : null}
          <HomeOngoingDeliveries
            orders={ongoingOrders}
            onPress={(order, chatFrom) =>
              navigation.navigate('OngoingDeliveryNavigator', {
                screen: 'OngoingDelivery',
                params: { orderId: order.id, chatFrom },
              })
            }
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('MainNavigator', { screen: 'DeliveryHistory' })}
          >
            <HomeDeliveriesSummary />
          </TouchableOpacity>
          <View style={{ marginVertical: padding }}>
            <FreshDeskCard
              onPress={() =>
                Linking.openURL(
                  'https://appjusto.freshdesk.com/support/solutions/folders/67000533349'
                )
              }
            />
          </View>
          <View style={{ marginBottom: padding }}>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Compartilhe esse movimento por uma economia mais justa."
            />
          </View>
          <View style={{ marginBottom: padding }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProfileNavigator', { screen: 'PartnersAndDiscounts' })
              }
            >
              <HomeCard
                icon={<IconPartners />}
                title={t('Parceiros com descontos')}
                subtitle={t(
                  'Veja as negociações coletivas que o AppJusto conseguir para a categoria'
                )}
              />
            </TouchableOpacity>
          </View>
          <ModalChooser />
        </PaddedView>
      </ScrollView>
      <LocationDisclosureModal />
    </View>
  );
}

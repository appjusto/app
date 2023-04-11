import { CourierStatus } from '@appjusto/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { MaintenanceModal } from '../../../../common/components/views/MaintenanceModal';
import { UpgradeVersionModal } from '../../../../common/components/views/UpgradeVersionModal';
import { useNotificationToken } from '../../../../common/hooks/useNotificationToken';
import { IconHomeCourierRequests } from '../../../../common/icons/icon-home-courier-requests';
import { IconPartners } from '../../../../common/icons/icon-partners';
import { IconShareGreen } from '../../../../common/icons/icon-share-green';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import HomeOngoingDeliveries from '../../../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { useObserveActiveRequests } from '../../../../common/store/api/courier/hooks/useObserveActiveRequests';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { getCourier } from '../../../../common/store/courier/selectors';
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
import { HomeDeliveriesSummary } from './HomeDeliveriesSummary';
import { LocationDisclosureModal } from './LocationDisclosureModal';

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
  const requests = useObserveActiveRequests();
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
          onFleetDetail={(fleetId) => {
            navigation.navigate('ProfileNavigator', {
              screen: 'ChooseFleet',
              params: {
                fleetId,
              },
            });
          }}
        />
        <PaddedView>
          {requests.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MatchingNavigator', {
                  screen: 'OrderRequests',
                });
              }}
            >
              <View style={{ marginVertical: padding }}>
                <HomeCard
                  icon={<IconHomeCourierRequests />}
                  title={t('Novos pedidos disponíveis')}
                  subtitle={t('Existem pedidos que você pode aceitar agora mesmo!')}
                  bgColor={colors.yellow}
                  borderColor={colors.black}
                />
              </View>
            </TouchableOpacity>
          ) : null}
          <HomeOngoingDeliveries
            onPress={(order, chatFrom) => {
              navigation.navigate('OngoingDeliveryNavigator', {
                screen: 'OngoingDelivery',
                params: { orderId: order.id, chatFrom },
              });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MainNavigator', { screen: 'DeliveryHistory' });
            }}
            style={{ marginBottom: padding }}
          >
            <HomeDeliveriesSummary />
          </TouchableOpacity>
          <View style={{ marginBottom: padding }}>
            <FreshDeskCard
              onPress={() => {
                track('opening freshdesk url');
                Linking.openURL(
                  'https://appjusto.freshdesk.com/support/solutions/folders/67000533349'
                );
              }}
            />
          </View>
          <View style={{ marginBottom: padding }}>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Compartilhe esse movimento por uma economia mais justa."
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileNavigator', { screen: 'PartnersAndDiscounts' });
              }}
            >
              <HomeCard
                icon={<IconPartners />}
                title={t('Parceiros com descontos')}
                subtitle={t(
                  'Veja as negociações coletivas que o AppJusto conseguiu para a categoria'
                )}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('RecommendRestaurant')}
            style={{ marginTop: padding }}
          >
            <HomeCard
              icon={<IconShareGreen />}
              title={t('Indique um restaurante')}
              subtitle={t(
                'Conhece algum restaurante que ainda não está no AppJusto? Manda pra gente!'
              )}
            />
          </TouchableOpacity>
          <MaintenanceModal />
          <UpgradeVersionModal />
        </PaddedView>
      </ScrollView>
      <LocationDisclosureModal />
    </View>
  );
}

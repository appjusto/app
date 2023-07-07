import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MaintenanceModal } from '../../../../common/components/views/MaintenanceModal';
import { UpgradeVersionModal } from '../../../../common/components/views/UpgradeVersionModal';
import { useNotificationToken } from '../../../../common/hooks/useNotificationToken';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { getCourier } from '../../../../common/store/courier/selectors';
import { padding, screens, texts } from '../../../../common/styles';
import {
  startLocationUpdatesTask,
  stopLocationUpdatesTask,
} from '../../../../common/utils/location';
import { t } from '../../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../../strings/values';
import { SituationHeader } from '../../../common/situation-header/SituationHeader';
import { DeliveryProblemCard } from '../../ongoing/delivery-problem/DeliveryProblemCard';
import { ApprovedParamList } from '../../types';
import { BlockProcessContent } from '../howitworks/blocks/BlockProcessContent';
import { MainParamList } from '../types';
import HomeControls from './HomeControls';
import { LocationDisclosureModal } from './LocationDisclosureModal';
import { CourierHomeCardList } from './cards/CourierHomeCardList';
import { NeedHelpModal } from './help/NeedHelpModal';

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
  const working = status === 'available' || status === 'dispatching';
  // state
  const [supportModalVisible, setSupportModalVisible] = React.useState(false);
  // side effects
  useNotificationToken();
  useSegmentScreen('Home');
  // test only
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate('OngoingDeliveryNavigator', {
  //       screen: 'DeliveryCompleted',
  //       params: { fee: 1000, orderId: '1234' },
  //     });
  //   }, 100);
  // }, []);
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
        {status !== 'inactive' ? (
          <View style={{ flex: 1 }}>
            <HomeControls
              onFleetDetail={() => {
                navigation.navigate('ProfileNavigator', {
                  screen: 'ChooseFleet',
                });
              }}
            />
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
              onNeedSupportPress={() => setSupportModalVisible(true)}
              onRecommendBusinessPress={() => navigation.navigate('RecommendRestaurant')}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <SituationHeader variant="inactive" />
            <View style={{ paddingHorizontal: padding, marginTop: padding }}>
              <Text style={{ ...texts.xl, marginBottom: padding }}>
                Dúvidas? Fale com o nosso suporte
              </Text>
              <DeliveryProblemCard
                title={t('Suporte AppJusto')}
                subtitle={t('Fale com um de nossos atendentes através do nosso WhatsApp')}
                onPress={() => {
                  track('opening whatsapp chat with backoffice');
                  Linking.openURL(AppJustoAssistanceWhatsAppURL);
                }}
                situation="support"
              />
            </View>
            <BlockProcessContent variant="blocked" />
          </View>
        )}
      </ScrollView>
      <MaintenanceModal />
      <UpgradeVersionModal />
      <LocationDisclosureModal />
      <NeedHelpModal
        visible={supportModalVisible}
        onClose={() => setSupportModalVisible(false)}
        onComplainPress={() => {
          setSupportModalVisible(false);
          setTimeout(() => {
            navigation.navigate('ComplaintScreen');
          }, 100);
        }}
      />
    </View>
  );
}

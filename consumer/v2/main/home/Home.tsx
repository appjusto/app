import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { MaintenanceModal } from '../../../../common/components/views/MaintenanceModal';
import { useBusinessDeeplink } from '../../../../common/hooks/useBusinessDeeplink';
import { useNotificationToken } from '../../../../common/hooks/useNotificationToken';
import { IconLogin } from '../../../../common/icons/icon-login';
import { IconShareGreen } from '../../../../common/icons/icon-share-green';
import { useUpdateLocation } from '../../../../common/location/useUpdateLocation';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import HomeOngoingDeliveries from '../../../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { UnloggedParamList } from '../../../../common/screens/unlogged/types';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { LoggedNavigatorParamList } from '../../types';
import { MainNavigatorParamList } from '../types';
import { HomeControls } from './controls/HomeControls';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Home'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
>;
type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // redux store
  const consumer = useSelector(getConsumer);
  // side effects
  useUpdateLocation();
  useNotificationToken();
  useBusinessDeeplink();
  //tracking
  useSegmentScreen('Home');
  // handler
  const navigateToWelcomeScreen = () => {
    navigation.navigate('WelcomeScreen');
  };
  // UI
  return (
    <View style={[screens.headless, screens.config]}>
      {/* <StatusBar /> */}
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <HomeControls
          onStartOrderPress={(type) => {
            if (type === 'food') {
              navigation.navigate('FoodOrderNavigator', { screen: 'FoodOrderHome' });
            } else {
              if (consumer) {
                navigation.navigate('P2POrderNavigator', { screen: 'CreateOrderP2P' });
              } else {
                navigateToWelcomeScreen();
              }
            }
          }}
        />
        <PaddedView>
          <HomeOngoingDeliveries
            onPress={(order, chatFrom) => {
              if (order.status === 'declined') {
                navigation.navigate('OngoingOrderNavigator', {
                  screen: 'OngoingOrderDeclined',
                  params: {
                    orderId: order.id,
                  },
                });
              }
              // only 'confirming' status?
              if (order.paymentMethod === 'pix' && order.status === 'confirming') {
                navigation.navigate('OngoingOrderNavigator', {
                  screen: 'OngoingOrderConfirming',
                  params: { orderId: order.id },
                });
              } else {
                navigation.navigate('OngoingOrderNavigator', {
                  screen: 'OngoingOrder',
                  params: {
                    orderId: order.id,
                    chatFrom,
                  },
                });
              }
            }}
          />
          {!consumer ? (
            <TouchableOpacity onPress={navigateToWelcomeScreen}>
              <HomeCard
                icon={<IconLogin />}
                title={t('Crie uma conta ou faça o login')}
                subtitle={t('Você precisa estar logado para pedir')}
                // grey
              />
            </TouchableOpacity>
          ) : null}
          {!consumer ? <View style={{ height: padding }} /> : null}
          <HomeShareCard
            title="Divulgue o AppJusto"
            subtitle="Compartilhe esse movimento por uma economia mais justa"
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FoodOrderNavigator', {
                screen: 'RecommendRestaurant',
                params: { returnToHome: true },
              })
            }
            style={{ marginTop: padding }}
          >
            <HomeCard
              icon={<IconShareGreen />}
              title={t('Indique um restaurante')}
              subtitle={t(
                'Ainda não encontrou o restaurante que queria por aqui? Manda pra gente!'
              )}
            />
          </TouchableOpacity>
          <MaintenanceModal />
          {/* <UpgradeVersionModal /> */}
        </PaddedView>
      </ScrollView>
    </View>
  );
}

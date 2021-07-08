import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { HomeCouriersNearbyCard } from '../../../../common/screens/home/cards/HomeCouriersNearbyCard';
import HomeOngoingDeliveries from '../../../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { UnloggedParamList } from '../../../../common/screens/unlogged/types';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { getOrders } from '../../../../common/store/order/selectors';
import { padding, screens } from '../../../../common/styles';
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
  const ongoingOrders = useSelector(getOrders);
  // UI
  return (
    <SafeAreaView style={[screens.config]}>
      {/* <StatusBar /> */}
      <ScrollView>
        <HomeControls
          onStartOrderPress={(type) => {
            if (type === 'food') {
              navigation.navigate('FoodOrderNavigator', { screen: 'FoodOrderHome' });
            } else {
              if (consumer) {
                navigation.navigate('P2POrderNavigator', { screen: 'CreateOrderP2P' });
              } else {
                navigation.navigate('WelcomeScreen');
              }
            }
          }}
        />
        <PaddedView>
          <HomeOngoingDeliveries
            orders={ongoingOrders}
            onPress={(order, chatFrom) =>
              navigation.navigate('OngoingOrderNavigator', {
                screen: 'OngoingOrder',
                params: {
                  orderId: order.id,
                  chatFrom,
                },
              })
            }
          />
          <HomeCouriersNearbyCard />
          <View style={{ marginTop: padding }}>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Compartilhe esse movimento por uma economia mais justa."
            />
          </View>
        </PaddedView>
      </ScrollView>
    </SafeAreaView>
  );
}

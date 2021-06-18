import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import useLastKnownLocation from '../../../../common/hooks/useLastKnownLocation';
import { IconMotocycle } from '../../../../common/icons/icon-motocycle';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import HomeOngoingDeliveries from '../../../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { getOrders } from '../../../../common/store/order/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { LoggedNavigatorParamList } from '../../types';
import { MainNavigatorParamList } from '../types';
import { HomeControls } from './controls/HomeControls';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Home'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const ongoingOrders = useSelector(getOrders);
  // state
  const { coords } = useLastKnownLocation();
  const [availableCouriers, setAvailableCouriers] = React.useState(0);
  // fetch total couriers
  const fetchTotalCouriersNearby = async () => {
    if (!coords) return;
    try {
      const { total } = await api.courier().fetchTotalCouriersNearby(coords);
      setAvailableCouriers(total);
    } catch (error) {
      console.log(
        `Error while calling api.courier().fetchTotalCouriersNearby(${coords.latitude},${coords.longitude})`
      );
      console.log(error);
      Sentry.Native.captureException(error);
    }
  };
  React.useEffect(() => {
    navigation.addListener('focus', fetchTotalCouriersNearby);
    return () => navigation.removeListener('focus', fetchTotalCouriersNearby);
  });
  React.useEffect(() => {
    fetchTotalCouriersNearby();
  }, [coords]);
  const dispatch = useDispatch();
  const toastHandler = () => {
    dispatch(showToast(t('Sua sessão expirou. Faça login novamente.'), 'error'));
  };
  // UI
  return (
    <SafeAreaView style={[screens.config]}>
      {/* <StatusBar /> */}
      <ScrollView>
        <HomeControls
          onStartOrderPress={(type) => {
            if (type === 'p2p') {
              navigation.navigate('P2POrderNavigator', { screen: 'CreateOrderP2P' });
            } else {
              navigation.navigate('FoodOrderNavigator', { screen: 'FoodOrderHome' });
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
          <View>
            <HomeCard
              icon={<IconMotocycle circleColor={colors.grey50} width={64} height={64} />}
              title={`${availableCouriers} ${t('entregadores disponíveis')}`}
              subtitle={t(`num raio de 15km`)}
            />
          </View>
          <View style={{ marginTop: padding }}>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Compartilhe esse movimento por uma economia mais justa."
            />
          </View>
          <View style={{ marginTop: padding }}>
            <TouchableOpacity onPress={toastHandler}>
              <Text>MOSTAR TOAST</Text>
            </TouchableOpacity>
          </View>
        </PaddedView>
      </ScrollView>
    </SafeAreaView>
  );
}

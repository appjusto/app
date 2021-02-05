import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as icons from '../../assets/icons';
import { ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import useLastKnownLocation from '../../common/hooks/useLastKnownLocation';
import HomeCard from '../../common/screens/home/cards/HomeCard';
import HomeOngoingDeliveries from '../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../common/screens/home/cards/HomeShareCard';
import { getOrders } from '../../common/store/order/selectors';
import { padding, screens } from '../../common/styles';
import { t } from '../../strings';
import { LoggedParamList } from '../types';
import ConsumerHomeControls from './ConsumerHomeControls';
import { HomeNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'Home'>,
  BottomTabNavigationProp<LoggedParamList>
>;

type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'Home'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);

  // app state
  const ongoingOrders = useSelector(getOrders);

  // state
  const { coords, permissionResponse } = useLastKnownLocation();
  const [availableCouriers, setAvailableCouriers] = useState(0);

  // side effects
  // request location permission
  useEffect(() => {
    if (permissionResponse?.status === Location.PermissionStatus.DENIED) {
      navigation.navigate('PermissionDeniedFeedback', {
        title: t('Precisamos acessar sua localização'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  }, [permissionResponse]);

  useEffect(() => {
    if (!coords) return;
    (async () => {
      const { total } = await api.courier().fetchTotalCouriersNearby(coords);
      setAvailableCouriers(total);
    })();
  }, [coords]);

  // UI
  return (
    <View style={[screens.default, screens.headless]}>
      {/* <StatusBar /> */}
      <ScrollView>
        <ConsumerHomeControls navigation={navigation} />
        <PaddedView>
          <HomeOngoingDeliveries
            orders={ongoingOrders}
            onSelect={(order, openChat) =>
              navigation.navigate('OrderNavigator', {
                screen: 'OngoingOrder',
                params: {
                  orderId: order.id,
                  newMessage: openChat,
                },
              })
            }
          />
          <View>
            <HomeCard
              icon={icons.delivery}
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
        </PaddedView>
      </ScrollView>
    </View>
  );
}

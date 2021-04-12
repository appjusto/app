import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { t } from 'i18n-js';
import React, { useContext, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import useNotificationToken from '../../../../common/hooks/useNotificationToken';
import HomeOngoingDeliveries from '../../../../common/screens/home/cards/HomeOngoingDeliveries';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { getCourier } from '../../../../common/store/courier/selectors';
import { getOrders } from '../../../../common/store/order/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { padding, screens } from '../../../../common/styles';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';
import { FreshWorksCard } from './FreshWorksCard';
import HomeControls from './HomeControls';
import HomeDeliveriesSummary from './HomeDeliveriesSummary';
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

  // app state
  const courier = useSelector(getCourier)!;
  const ongoingOrders = useSelector(getOrders);

  // state
  const [notificationToken, shouldDeleteToken, shouldUpdateToken] = useNotificationToken(
    courier!.notificationToken
  );

  // side effects
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
          onPermissionDenied={() => {
            navigation.navigate('PermissionDenied', {
              title: t('Precisamos acessar a localização do seu dispositivo'),
              subtitle: t(
                'Para que possamos determinar o trajeto com precisão, precisamos que você dê acesso ao AppJusto para usar sua localização.'
              ),
            });
            // removing previous token
            dispatch(updateProfile(api)(courier!.id!, { notificationToken: null }));
          }}
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
            <FreshWorksCard />
          </View>
          <View style={{ marginBottom: padding }}>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Compartilhe esse movimento por uma economia mais justa."
            />
          </View>
          <ModalChooser />
          {/* <View style={{ marginTop: padding }}>
            <View>
              <DemandCard />
            </View>
          </View> */}
        </PaddedView>
      </ScrollView>
    </View>
  );
}

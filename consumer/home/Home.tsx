import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import React, { useEffect, useContext, useState } from 'react';
import { View, TouchableOpacity, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../assets/icons';
import { AppDispatch, ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import ShowIf from '../../common/components/views/ShowIf';
import useTallerDevice from '../../common/hooks/useTallerDevice';
import { getFlavor } from '../../common/store/config/selectors';
import { getOngoingOrders } from '../../common/store/order/selectors';
import { observeProfile } from '../../common/store/user/actions';
import { getUser } from '../../common/store/user/selectors';
import { colors, texts, padding, borders, halfPadding } from '../../common/styles';
import { t } from '../../strings';
import { LoggedParamList } from '../types';
import ConsumerHomeControls from './ConsumerHomeControls';
import HomeOngoingOrderCard from './cards/HomeOngoingOrderCard';
import { HomeNavigatorParamList } from './types';
import useLastKnownLocation from '../../common/hooks/useLastKnownLocation';
import { nanoid } from 'nanoid/non-secure';

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
  const dispatch = useDispatch<AppDispatch>();
  const tallerDevice = useTallerDevice();

  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const ongoingOrders = useSelector(getOngoingOrders);

  // state
  const [locationKey] = useState(nanoid());
  const { lastKnownLocation, permissionResponse } = useLastKnownLocation(true, locationKey);

  // side effects
  useEffect(() => {
    if (!user) return;
    return dispatch(observeProfile(api)(flavor, user.uid));
  }, [user]);

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
    console.log(lastKnownLocation);
    if (!lastKnownLocation) return;
    // TODO: get couriers working nearby
  }, [lastKnownLocation]);

  //availableCouriers and availableFleets
  //Todo: replace with real data
  const availableCouriers = 12;
  const availableFleets = 34;

  // UI
  const paddingTop = Constants.statusBarHeight;
  return (
    <ScrollView contentContainerStyle={{ paddingTop }} style={{ backgroundColor: colors.white }}>
      <ConsumerHomeControls navigation={navigation} />
      <PaddedView>
        {/* we need to make an order to check if this ShowIf is displaying correctly */}
        <ShowIf test={ongoingOrders.length > 0}>
          {() => (
            <PaddedView half>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('OngoingOrder', { orderId: ongoingOrders[0].id })
                }
              >
                <HomeOngoingOrderCard order={ongoingOrders[0]} />
              </TouchableOpacity>
            </PaddedView>
          )}
        </ShowIf>
        {/* TODO: add logic to display available couriers and fleets */}
        <TouchableOpacity onPress={() => {}}>
          <View
            style={[
              styles.card,
              {
                padding: tallerDevice ? padding : halfPadding,
                marginBottom: tallerDevice ? padding : halfPadding,
              },
            ]}
          >
            <Image source={icons.delivery} />
            <View style={{ marginLeft: padding }}>
              <Text style={{ ...texts.default }}>
                {availableCouriers} {t('entregadores disponíveis')}
              </Text>
              <Text style={{ ...texts.small, color: colors.darkGrey }}>
                {t(`em ${availableFleets} frotas ativas na sua região`)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HistoryNavigator', { screen: 'OrderHistory' })}
        >
          <View
            style={[
              styles.card,
              {
                padding: tallerDevice ? padding : halfPadding,
                marginBottom: tallerDevice ? padding : halfPadding,
              },
            ]}
          >
            <Image source={icons.requests} />
            <View style={{ marginLeft: padding }}>
              <Text style={{ ...texts.default }}>{t('Histórico de Pedidos')}</Text>
              <Text style={{ ...texts.small, color: colors.darkGrey }}>
                {t('Histórico de Pedidos')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* TODO: add logic to the share component below */}
        <TouchableOpacity>
          <View
            style={[
              styles.card,
              {
                padding: tallerDevice ? padding : halfPadding,
                marginBottom: tallerDevice ? padding : halfPadding,
              },
            ]}
          >
            <Image source={icons.share} />
            <View style={{ marginLeft: padding }}>
              <Text style={{ ...texts.default }}>{t('Divulgue o AppJusto')}</Text>
              <Text
                style={{
                  ...texts.small,
                  color: colors.darkGrey,
                  flexWrap: 'wrap',
                  maxWidth: '85%',
                }}
                numberOfLines={2}
              >
                {t('Compartilhe esse movimento por uma economia mais justa.')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </PaddedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    ...borders.default,
    borderColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
  },
});

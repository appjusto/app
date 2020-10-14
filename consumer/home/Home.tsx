import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { nanoid } from 'nanoid/non-secure';
import React, { useEffect, useContext, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../assets/icons';
import { AppDispatch, ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import useLastKnownLocation from '../../common/hooks/useLastKnownLocation';
import useTallerDevice from '../../common/hooks/useTallerDevice';
import HomeOngoingDeliveries from '../../common/screens/home/cards/HomeOngoingDeliveries';
import { getFlavor } from '../../common/store/config/selectors';
import { fetchTotalCouriersNearby } from '../../common/store/courier/actions';
import { observeProfile } from '../../common/store/user/actions';
import { getUser } from '../../common/store/user/selectors';
import { colors, texts, padding, borders, halfPadding } from '../../common/styles';
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
  const dispatch = useDispatch<AppDispatch>();
  const tallerDevice = useTallerDevice();

  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser)!;

  // state
  const [locationKey] = useState(nanoid());
  const { lastKnownLocation, permissionResponse } = useLastKnownLocation(true, locationKey);
  const [availableCouriers, setAvailableCouriers] = useState(0);

  // side effects
  useEffect(() => {
    return dispatch(observeProfile(api)(flavor, user.uid));
  }, []);

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
    if (!lastKnownLocation) return;
    (async () => {
      const { total } = await dispatch(fetchTotalCouriersNearby(api)(lastKnownLocation.coords));
      setAvailableCouriers(total);
    })();
  }, [lastKnownLocation]);

  // UI
  const paddingTop = Constants.statusBarHeight;
  return (
    <ScrollView contentContainerStyle={{ paddingTop }} style={{ backgroundColor: colors.white }}>
      <ConsumerHomeControls navigation={navigation} />
      <PaddedView>
        <HomeOngoingDeliveries
          onSelect={(order, openChat) =>
            navigation.navigate('OngoingOrder', { orderId: order.id, newMessage: openChat })
          }
        />
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
            <Text style={{ ...texts.small, color: colors.darkGrey }}>{t(`num raio de 15km`)}</Text>
          </View>
        </View>
        {/* <ShowIf test={ongoingOrders.length <= 0}>
          {() => (
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
          )}
        </ShowIf> */}
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

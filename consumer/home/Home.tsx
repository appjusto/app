import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React, { useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../assets/icons';
import { AppDispatch, ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import ShowIf from '../../common/components/views/ShowIf';
import { getFlavor } from '../../common/store/config/selectors';
import { getOngoingOrders } from '../../common/store/order/selectors';
import { observeProfile } from '../../common/store/user/actions';
import { getUser } from '../../common/store/user/selectors';
import { colors, texts, padding, borders } from '../../common/styles';
import { t } from '../../strings';
import HomeOngoingOrderCard from './cards/HomeOngoingOrderCard';
import { HomeNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'Home'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'Home'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const ongoingOrders = useSelector(getOngoingOrders);

  // side effects
  useEffect(() => {
    if (!user) return;
    return dispatch(observeProfile(api)(flavor, user.uid));
  }, [user]);

  // UI
  const paddingTop = Constants.statusBarHeight;
  return (
    <View style={{ flex: 1 }}>
      <PaddedView style={{ flex: 1, paddingTop, backgroundColor: colors.green }}>
        <Text style={{ ...texts.big, marginTop: padding }}>
          {t('Somos um delivery aberto, transparente e consciente')}
        </Text>
        {/* buttons */}
        <View style={{ flexDirection: 'row', marginTop: padding, justifyContent: 'space-between' }}>
          <View
            style={{
              width: '47.5%',
              paddingHorizontal: 12,
              backgroundColor: 'white',
              ...borders.default,
              borderColor: 'white',
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('CreateOrderP2P')}>
              <View style={{ width: '100%', height: '52%' }}>
                <Image
                  source={icons.illustration}
                  style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
                />
              </View>
              <Text style={{ marginTop: 8, ...texts.default }}>{t('Transportar Encomendas')}</Text>
              <Text style={{ marginTop: 8, ...texts.small, color: colors.darkGrey }}>
                {t('Para buscar e deixar pacotes')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '47.5%',
              paddingHorizontal: 12,
              backgroundColor: colors.lightGreen,
              ...borders.default,
              borderColor: 'white',
            }}
          >
            <TouchableOpacity>
              <View style={{ width: '100%', height: '52%' }}>
                <Image
                  source={icons.illustrationPizza}
                  style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
                />
              </View>
              <Text style={{ marginTop: 8, ...texts.default }}>
                {t('Restaurantes e alimentação')}
              </Text>
              <Text style={{ marginTop: 8, ...texts.small }}>
                {t('Seus preferidos estarão por aqui')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </PaddedView>
      {/* history */}
      <View style={{ width: '100%', height: '30%' }}>
        <ImageBackground
          source={icons.backgroundPattern}
          resizeMethod="resize"
          resizeMode="contain"
          style={{ height: '100%', width: '100%' }}
        >
          <View style={{ paddingHorizontal: 16, flex: 1, justifyContent: 'center' }}>
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
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

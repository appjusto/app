import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../assets/icons';
import { AppDispatch, ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/views/PaddedView';
import { getFlavor } from '../../common/store/config/selectors';
import { observeProfile } from '../../common/store/user/actions';
import { getUser } from '../../common/store/user/selectors';
import { colors, texts, padding, borders } from '../../common/styles';
import { t } from '../../strings';
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

  // side effects
  useEffect(() => {
    if (!user) return;
    return dispatch(observeProfile(api)(flavor, user.uid));
  }, [user]);

  // UI
  return (
    <View style={{ flex: 1 }}>
      <PaddedView style={{ flex: 1, backgroundColor: colors.green }}>
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
          style={{ height: 181, width: '100%' }}
        >
          <View style={{ paddingHorizontal: 16, flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <View style={{ ...styles.history, justifyContent: 'center' }}>
                <View style={{ height: 80, width: '20%' }}>
                  <Image source={icons.requests} />
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ ...texts.default }}>{t('Histórico de pedidos')}</Text>
                  <Text style={{ ...texts.small, color: colors.darkGrey }}>
                    {t('Você ainda não fez pedidos')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  history: {
    // marginHorizontal: 16,
    height: 96,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    marginTop: 24,
  },
});

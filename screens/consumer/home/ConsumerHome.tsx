import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { useDispatch } from 'react-redux';

import { navigationArrow, illustration, BG, requests } from '../../../assets/icons';
import useAuth from '../../../hooks/useAuth';
import { observeConsumer } from '../../../store/consumer/actions';
import { t } from '../../../strings';
import { AppDispatch, ApiContext } from '../../app/context';
import { colors, texts } from '../../common/styles';
import { HomeStackParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'ConsumerHome'>;
type ScreenRouteProp = RouteProp<HomeStackParamList, 'ConsumerHome'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ConsumerHome({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const [authState, user] = useAuth();

  // side effects
  useEffect(() => {
    if (!user) return;
    return dispatch(observeConsumer(api)(user.uid));
  }, [user]);

  // UI
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.greenContainer}>
        <View style={styles.searchBox}>
          <Image source={navigationArrow} />
          <Text style={{ ...texts.small, marginLeft: 9 }}>
            {t('Avenida Paulista, São Paulo, SP')}
          </Text>
        </View>
        <View style={styles.containerBigText}>
          <Text style={{ ...texts.big }}>
            {t('Somos um delivery aberto, transparente e consciente')}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <View style={styles.actionBox}>
            <TouchableOpacity onPress={() => navigation.navigate('CreateOrderP2P')}>
              <View style={styles.illustrationContainer}>
                <Image source={illustration} style={styles.illustration} />
              </View>
              <View style={styles.mediumContainer}>
                <Text style={{ ...texts.default }}>{t('Transportar Encomendas')}</Text>
              </View>
              <View style={styles.smallContainer}>
                <Text style={{ ...texts.small, color: colors.darkGrey }}>
                  {t('Para buscar e deixar pacotes')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.actionBox, backgroundColor: colors.lightGreen }}>
            <TouchableOpacity>
              <View style={styles.illustrationContainer}>
                <Image source={illustration} style={styles.illustration} />
              </View>
              <View style={styles.mediumContainer}>
                <Text style={{ ...texts.default }}>{t('Restaurantes e alimentação')}</Text>
              </View>
              <View style={styles.smallContainer}>
                <Text style={{ ...texts.small }}>{t('Seus preferidos estarão por aqui')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.whiteContainer}>
        <ImageBackground source={BG} style={{ height: '100%', width: '100%', flex: 1 }}>
          <View style={{ paddingHorizontal: 16, flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ConsumerHistory')}>
              <View style={{ ...styles.history, justifyContent: 'center' }}>
                <View style={styles.reqContainer}>
                  <Image source={requests} />
                </View>
                <View style={styles.textContainer}>
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
  greenContainer: {
    width: '100%',
    height: '70%',
    backgroundColor: colors.green,
    paddingHorizontal: 16,
  },
  whiteContainer: {
    width: '100%',
    height: '30%',
  },
  searchBox: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    height: 40,
    width: '66.6%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: 32,
    marginTop: 48,
    alignItems: 'center',
  },
  containerBigText: {
    width: '100%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 32,
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 224,
    marginTop: 24,
    justifyContent: 'space-between',
  },
  actionBox: {
    width: '47.5%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  illustrationContainer: {
    width: '100%',
    height: '52%',
  },
  illustration: {
    // marginHorizontal: 12,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  mediumContainer: {
    height: 36,
    marginTop: 8,
  },
  smallContainer: {
    height: 32,
    width: '80%',
    marginTop: 8,
  },
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
  reqContainer: {
    // paddingHorizontal: 16,
    height: 80,
    width: '20%',
  },
  request: {
    flex: 1,
    resizeMode: 'cover',
  },
  textContainer: {
    // paddingLeft: 16,
    justifyContent: 'center',
  },
});

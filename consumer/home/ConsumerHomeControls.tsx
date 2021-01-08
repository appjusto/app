import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as icons from '../../assets/icons';
import PaddedView from '../../common/components/containers/PaddedView';
import ShowIf from '../../common/components/views/ShowIf';
import useTallerDevice from '../../common/hooks/useTallerDevice';
import { borders, colors, doublePadding, halfPadding, padding, texts } from '../../common/styles';
import { t } from '../../strings';
import { LoggedParamList } from '../types';
import { HomeNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'Home'>,
  BottomTabNavigationProp<LoggedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

const { width } = Dimensions.get('window');
export default function ({ navigation }: Props) {
  // context
  const tallerDevice = useTallerDevice();

  return (
    <PaddedView style={{ backgroundColor: colors.green }}>
      <ShowIf test={tallerDevice}>
        {() => (
          <Text
            style={[
              texts.big,
              {
                paddingBottom: tallerDevice ? doublePadding : padding,
                marginTop: tallerDevice ? doublePadding : 0,
              },
            ]}
          >
            {t('Somos um delivery aberto, transparente e consciente.')}
          </Text>
        )}
      </ShowIf>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: tallerDevice ? doublePadding : halfPadding,
        }}
      >
        <View style={[styles.controlItem, { backgroundColor: colors.white }]}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateOrderP2P')}>
            <Image source={icons.consumerHomeIllustration} />
            <Text style={[texts.default, { paddingTop: 4 }]}>{t('Transporte de encomendas')}</Text>
            <Text style={[texts.small, { paddingTop: halfPadding, color: colors.darkGrey }]}>
              {t('Para buscar e deixar pacotes')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[styles.controlItem, { backgroundColor: colors.lightGreen, flexDirection: 'row' }]}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RestaurantsNavigator', { screen: 'RestaurantsHome' })
            }
          >
            <View>
              <Image source={icons.consumerHomePizza} />
              <Text style={[texts.default, { paddingTop: 4 }]}>
                {t('Restaurantes e alimentação')}
              </Text>
              <Text style={[texts.small, { paddingTop: halfPadding, color: colors.darkGrey }]}>
                {t('Peça comida de uma forma justa')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  controlItem: {
    ...borders.default,
    borderColor: colors.white,
    width: Math.floor((width - 3 * padding) / 2),
    // height: Math.floor(height * 0.30),
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});

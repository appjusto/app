import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as icons from '../../../../assets/icons';
import { borders, colors, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { RestaurantsNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'RestaurantsHome'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('RestaurantSearch')}>
      <View
        style={{
          height: 60,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          ...borders.default,
          borderColor: colors.black,
        }}
      >
        <Text style={{ ...texts.default, color: colors.darkGrey }}>
          {t('Encontre um prato ou restaurante')}
        </Text>
        <Image source={icons.search} />
      </View>
    </TouchableWithoutFeedback>
  );
}

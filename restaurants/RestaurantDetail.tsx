import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { ApiContext } from '../common/app/context';
import { getUser } from '../common/store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../common/utils/formatters';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';
import SingleHeader from './SingleHeader';
import * as fake from './fakeData';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'RestaurantDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  const { restaurantId, restaurantName } = route.params ?? {};
  // context
  const api = useContext(ApiContext);

  // app state
  const user = useSelector(getUser)!;

  const restaurantQuery = (key: string, restaurantId: string) =>
    api.menu().getRestaurant(restaurantId);
  const { data: restaurant } = useQuery(['restaurant', restaurantId], restaurantQuery);

  //UI
  const RestaurantCard = () => (
    <View style={{ marginHorizontal: 12 }}>
      <Image source={fake.card} style={{ height: 120, width: '100%', borderRadius: 8 }} />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ ...texts.mediumToBig }}>{restaurantName}</Text>
          <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {separateWithDot(formatDistance(2000), formatDuration(1800))}
          </Text>
        </View>
        <View>
          <Image source={fake.cardIcon} />
        </View>
      </View>
    </View>
  );

  const RestaurantItem = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          borderColor: colors.grey,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingLeft: padding,
          paddingRight: halfPadding,
          marginVertical: halfPadding,
        }}
      >
        <View style={{ width: '60%' }}>
          <Text style={{ ...texts.default }}>{t('Nome do item')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }} numberOfLines={2}>
            {t('Descrição do item que será exibida em até 2 linhas e o restante ficará...')}
          </Text>
          <Text style={{ ...texts.default }}>{t('R$ 00,00')}</Text>
        </View>
        <View>
          <Image source={fake.itemRectangle} style={{ height: 96, width: 96, borderRadius: 8 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ ...screens.default }}>
      <RestaurantCard />
      {/* replace all the sections with flatlists rendering <RestaurantItem /> components */}
      <SingleHeader title="Categoria #1" />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <SingleHeader title="Categoria #2" />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <SingleHeader title="Categoria #3" />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
      <RestaurantItem onPress={() => navigation.navigate('ItemDetail')} />
    </ScrollView>
  );
}

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, SectionList } from 'react-native';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { ApiContext } from '../common/app/context';
import { useOrderedMenu } from '../common/common-logic/useOrderedMenu';
import { getUser } from '../common/store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import SingleHeader from './SingleHeader';
import RestaurantCard from './components/RestaurantCard';
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

  const orderedMenu = useOrderedMenu(restaurantId);
  // console.log(orderedMenu);

  const sections = orderedMenu.map((category) => ({
    title: category.name,
    data: category.products,
  }));

  // setting the restaurant name on the header as soon as the user navigates to the screen
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurantName,
    });
  }, [route.params]);

  console.log(restaurant);

  //UI
  type RestItemProps = {
    name: string;
    description: string;
    price: number;
    onPress: () => void;
  };
  const RestaurantItem = ({ name, description, price, onPress }: RestItemProps) => (
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
          <Text style={{ ...texts.default }}>{name}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }} numberOfLines={2}>
            {description}
          </Text>
          <Text style={{ ...texts.default }}>{price}</Text>
        </View>
        <View>
          <Image source={fake.itemRectangle} style={{ height: 96, width: 96, borderRadius: 8 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
  if (!restaurant)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  return (
    <SectionList
      style={{ ...screens.default }}
      keyExtractor={(item) => item.id}
      sections={sections}
      ListHeaderComponent={
        <View>
          <RestaurantCard
            name={restaurant.name}
            onPress={() => navigation.navigate('AboutRestaurant', { restaurant })}
            canNavigate
          />
        </View>
      }
      renderSectionHeader={({ section }) => <SingleHeader title={section.title} />}
      renderItem={({ item }) => {
        return (
          <RestaurantItem
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            onPress={() => navigation.navigate('ItemDetail', { item })}
          />
        );
      }}
    />
  );
}

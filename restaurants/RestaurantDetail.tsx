import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Business, WithId } from 'appjusto-types';
import React, { useContext } from 'react';
import { ActivityIndicator, Image, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { ApiContext } from '../common/app/context';
import useMenu from '../common/hooks/queries/useMenu';
import { colors, halfPadding, padding, screens, texts } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import RestaurantCard from './components/RestaurantCard';
import * as fake from './fakeData';
import SingleHeader from './SingleHeader';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'RestaurantDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  const { restaurantId, restaurantName } = route.params;
  // context
  const api = useContext(ApiContext);

  // app state
  const { data: restaurant } = useQuery<WithId<Business>, Error>(['restaurant', restaurantId], () =>
    api.menu().fetchRestaurant(restaurantId)
  );
  // const { data: menu } = useQuery<CategoryWithProducts[], Error>(
  //   ['restaurant-menu', restaurantId],
  //   () => api.menu().fetchRestaurantMenu(restaurantId)
  // );
  const menu = useMenu(restaurantId);

  const sections =
    menu?.map((category) => ({
      title: category.name,
      data: category.products,
    })) ?? [];

  // setting the restaurant name on the header as soon as the user navigates to the screen
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurantName,
    });
  }, [route.params]);

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
            name={restaurant.name ?? ''}
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
            description={item.description ?? ''}
            price={item.price ?? 0}
            onPress={() => navigation.navigate('ItemDetail', { item })}
          />
        );
      }}
    />
  );
}

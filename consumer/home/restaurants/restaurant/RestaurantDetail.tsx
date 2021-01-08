import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { useContextBusiness } from '../../../../common/store/context/business';
import { useContextMenu } from '../../../../common/store/context/business/config';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import RestaurantCard from '../components/RestaurantCard';
import * as fake from '../fakeData';
import SingleHeader from '../SingleHeader';
import { RestaurantNavigatorParamList } from './types';

type RestItemProps = {
  name: string;
  description: string;
  price: number;
  onPress: () => void;
};

type ScreenNavigationProp = StackNavigationProp<RestaurantNavigatorParamList>;
type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'RestaurantDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const RestaurantDetail = React.memo(({ navigation, route }: Props) => {
  // context
  const restaurant = useContextBusiness();
  const menu = useContextMenu();
  // side effects
  // setting the restaurant name on the header as soon as the user navigates to the screen
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [route.params]);

  //UI
  const sections =
    menu?.map((category) => ({
      title: category.name,
      data: category.products,
    })) ?? [];
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
            onPress={() => navigation.navigate('AboutRestaurant')}
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
            onPress={() => navigation.navigate('ItemDetail', { productId: item.id })}
          />
        );
      }}
    />
  );
});

export default RestaurantDetail;

import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, SectionList, TouchableOpacity, View } from 'react-native';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { useContextMenu } from '../../../../../common/store/context/menu';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, halfPadding, padding, screens } from '../../../../../common/styles';
import { RestaurantHeader } from '../../common/RestaurantHeader';
import { ProductListItem } from '../product/ProductListItem';
import { RestaurantNavigatorParamList } from '../types';
import { CartButton } from './CartButton';

type ScreenNavigationProp = StackNavigationProp<RestaurantNavigatorParamList>;
// type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'RestaurantDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  // route: ScreenRouteProp;
};

export const RestaurantDetail = React.memo(({ navigation }: Props) => {
  // context
  const restaurant = useContextBusiness();
  const activeOrder = useContextActiveOrder();
  const menu = useContextMenu();
  // side effects
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [navigation, restaurant]);

  // UI
  const sections =
    menu?.map((category) => ({
      title: category.name,
      data: category.items ?? [],
    })) ?? [];
  if (!restaurant)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  return (
    <View style={{ ...screens.default, paddingBottom: padding }}>
      <SectionList
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        sections={sections}
        ListHeaderComponent={
          <View style={{ marginBottom: halfPadding }}>
            <RestaurantHeader
              restaurant={restaurant}
              onPress={() => navigation.navigate('AboutRestaurant')}
              canNavigate
            />
          </View>
        }
        renderSectionHeader={({ section }) => {
          return !isEmpty(section.data) ? (
            <View style={{ marginTop: padding }}>
              <SingleHeader title={section.title} />
            </View>
          ) : null;
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('ItemDetail', { productId: item.id })}
            >
              <ProductListItem key={item.id} product={item} complements={item.complementsEnabled} />
            </TouchableOpacity>
          );
        }}
      />
      {restaurant.status === 'open' && restaurant.enabled ? (
        <TouchableOpacity onPress={() => navigation.navigate('FoodOrderCheckout')}>
          <HR />
          <CartButton order={activeOrder} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

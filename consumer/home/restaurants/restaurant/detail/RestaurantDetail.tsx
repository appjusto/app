import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, SectionList, TouchableOpacity, View } from 'react-native';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import { useMenu } from '../../../../../common/store/api/business/hooks/useMenu';
import {
  useContextBusiness,
  useContextBusinessId,
} from '../../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, screens } from '../../../../../common/styles';
import { RestaurantHeader } from '../../components/RestaurantHeader';
import { CartButton } from '../CartButton';
import { RestaurantNavigatorParamList } from '../types';
import { ProductListItem } from './ProductListItem';

type ScreenNavigationProp = StackNavigationProp<RestaurantNavigatorParamList>;
// type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'RestaurantDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  // route: ScreenRouteProp;
};

const RestaurantDetail = React.memo(({ navigation }: Props) => {
  // context
  const restaurant = useContextBusiness();
  const activeOrder = useContextActiveOrder();
  // state
  const menu = useMenu(useContextBusinessId());
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
    <View style={{ ...screens.default }}>
      <SectionList
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        sections={sections}
        ListHeaderComponent={
          <View>
            <RestaurantHeader
              restaurant={restaurant}
              onPress={() => navigation.navigate('AboutRestaurant')}
              canNavigate
            />
          </View>
        }
        renderSectionHeader={({ section }) => <SingleHeader title={section.title} />}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('ItemDetail', { productId: item.id })}
            >
              <ProductListItem key={item.id} product={item} />
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate('OrderCheckout')}>
        <CartButton order={activeOrder} />
      </TouchableOpacity>
    </View>
  );
});

export default RestaurantDetail;

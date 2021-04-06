import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, SectionList, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../common/app/context';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import { useMenu } from '../../../../../common/store/api/business/hooks/useMenu';
import { getOrderTotal } from '../../../../../common/store/api/order/helpers';
import {
  useContextBusiness,
  useContextBusinessId,
} from '../../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
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
  const dispatch = useDispatch<AppDispatch>();
  // state
  const menu = useMenu(useContextBusinessId());
  const orderTotal = getOrderTotal(activeOrder!);
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
  //handlers
  const cartHandler = () => {
    if (orderTotal < restaurant!.minimumOrder!) {
      dispatch(
        showToast(
          t(`O pedido mínimo nesse restaurante é de ${formatCurrency(restaurant!.minimumOrder!)}`)
        )
      );
    } else {
      navigation.navigate('FoodOrderCheckout');
    }
  };
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
        renderSectionHeader={({ section }) => (
          <View style={{ marginTop: padding }}>
            <SingleHeader title={section.title} />
          </View>
        )}
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
      <TouchableOpacity onPress={cartHandler}>
        <HR />
        <CartButton order={activeOrder} />
      </TouchableOpacity>
    </View>
  );
});

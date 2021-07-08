import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, SectionList, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { useMenu } from '../../../../../common/store/api/business/hooks/useMenu';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import {
  useContextBusiness,
  useContextBusinessId,
} from '../../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, halfPadding, padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { RestaurantHeader } from '../../common/RestaurantHeader';
import { FoodOrderNavigatorParamList } from '../../types';
import { ProductListItem } from '../product/ProductListItem';
import { RestaurantNavigatorParamList } from '../types';
import { CartButton } from './CartButton';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RestaurantNavigatorParamList, 'RestaurantDetail'>,
  CompositeNavigationProp<
    StackNavigationProp<FoodOrderNavigatorParamList, 'RestaurantNavigator'>,
    StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
  >
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const RestaurantDetail = React.memo(({ navigation }: Props) => {
  // context
  const restaurant = useContextBusiness();
  const activeOrder = useContextActiveOrder();
  // redux
  const consumer = useSelector(getConsumer);
  // state
  const menu = useMenu(useContextBusinessId());
  // side effects
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [navigation, restaurant]);
  console.log(consumer?.id);
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
      {!consumer ? (
        <PaddedView>
          <DefaultButton
            title={t('Para pedir, faça login')}
            onPress={() => navigation.navigate('WelcomeScreen')}
          />
        </PaddedView>
      ) : null}
      {restaurant.status === 'open' && restaurant.enabled ? (
        <TouchableOpacity onPress={() => navigation.navigate('FoodOrderCheckout')}>
          <HR />
          <CartButton order={activeOrder} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

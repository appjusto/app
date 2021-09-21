import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, SectionList, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { useContextCategoriesWithProducts } from '../../../../../common/store/context/menu';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, halfPadding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';
import { ProductListItem } from '../product/ProductListItem';
import { RestaurantNavigatorParamList } from '../types';
import { CartButton } from './CartButton';
import { RestaurantDetailHeader } from './RestaurantDetailHeader';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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
  const categoriesWithProducts = useContextCategoriesWithProducts();
  // redux
  const consumer = useSelector(getConsumer);

  //

  // side effects
  // setting the restaurant.name in the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [navigation, restaurant]);
  // handlers

  // UI
  const sections =
    categoriesWithProducts?.map((category) => ({
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
        scrollIndicatorInsets={{ right: 1 }}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        sections={sections}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <RestaurantDetailHeader
            restaurant={restaurant}
            onAboutPress={() => navigation.navigate('AboutRestaurant')}
          />
        }
        renderSectionHeader={({ section }) => {
          return !isEmpty(section.data) ? (
            <View style={{ marginTop: halfPadding, paddingRight: 12 }}>
              <SingleHeader title={section.title} textTransform="capitalize" />
            </View>
          ) : null;
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ItemDetail', { productId: item.id })}
          >
            <ProductListItem
              key={item.id}
              product={item}
              business={restaurant}
              hasComplements={item.complementsEnabled}
            />
          </TouchableOpacity>
        )}
      />
      {!consumer ? (
        <PaddedView>
          <DefaultButton
            title={t('Faça login para pedir')}
            onPress={() => navigation.replace('WelcomeScreen')}
          />
        </PaddedView>
      ) : null}
      {consumer && restaurant.status === 'open' && restaurant.enabled ? (
        <TouchableOpacity onPress={() => navigation.navigate('FoodOrderCheckout')}>
          <HR />
          <CartButton order={activeOrder} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

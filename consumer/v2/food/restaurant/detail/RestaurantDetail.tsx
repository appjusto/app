import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, SectionList, Share, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { useContextMenu } from '../../../../../common/store/context/menu';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, halfPadding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { AppJustoSiteURL } from '../../../../../strings/values';
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
  const menu = useContextMenu();
  // redux
  const consumer = useSelector(getConsumer);

  // side effects
  React.useLayoutEffect(() => {
    const shareRestaurant = () => {
      //this needs the deeplinks Italo appointed in the backlog (notion)
      try {
        Share.share({
          message: `Pedi em ${
            restaurant!.name
          } usando o AppJusto, uma plataforma de delivery mais justa para clientes, entregadores e restaurantes. Peça também e faça parte desse movimento!`,
          title: 'AppJusto',
          url: AppJustoSiteURL,
        });
      } catch (error) {}
    };
    navigation.setOptions({
      title: restaurant?.name ?? '',
      headerRight: () => (
        <TouchableOpacity onPress={shareRestaurant}>
          <Ionicons name="share-social-outline" size={24} style={{ paddingRight: 12 }} />
        </TouchableOpacity>
      ),
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
        scrollIndicatorInsets={{ right: 1 }}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        sections={sections}
        stickySectionHeadersEnabled={false}
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
            <View style={{ marginTop: halfPadding }}>
              <SingleHeader title={section.title} textTransform="capitalize" />
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

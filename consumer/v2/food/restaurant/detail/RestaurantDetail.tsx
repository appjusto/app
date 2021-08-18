import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  SectionList,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import useTallerDevice from '../../../../../common/hooks/useTallerDevice';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { useContextCategoriesWithProducts } from '../../../../../common/store/context/menu';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { borders, colors, halfPadding, screens, texts } from '../../../../../common/styles';
import { getExtra } from '../../../../../common/utils/config';
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
  const restaurant = useContextBusiness()!;
  const activeOrder = useContextActiveOrder();
  const categoriesWithProducts = useContextCategoriesWithProducts();
  const tallerDevice = useTallerDevice();
  // redux
  const consumer = useSelector(getConsumer);
  const extra = useSelector(getExtra);
  const domain = `${extra.environment.charAt(0)}.deeplink.appjusto.com.br`;

  // handler
  const shareRestaurantHandler = async () => {
    const shareUrl = restaurant.slug
      ? `https://${domain}/consumer/r?id=${restaurant.slug}`
      : `https://${domain}/consumer/r?id=${restaurant.code}`;
    try {
      Share.share({
        message: `Pedi em ${
          restaurant!.name
        } usando o AppJusto, uma plataforma de delivery mais justa para clientes, entregadores e restaurantes. Peça também e faça parte desse movimento: ${shareUrl}`,
        title: 'AppJusto',
        url: shareUrl,
      });
    } catch (error) {}
  };

  // side effects
  // setting the restaurant.name in the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [navigation, restaurant]);
  console.log(consumer?.id);
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
          <View style={{ marginBottom: halfPadding }}>
            <RestaurantHeader
              restaurant={restaurant}
              onPress={() => navigation.navigate('AboutRestaurant')}
              canNavigate
            />
            <TouchableOpacity
              style={{ paddingHorizontal: 12, paddingTop: 12 }}
              onPress={shareRestaurantHandler}
            >
              <PaddedView
                half
                style={{
                  flexDirection: 'row',
                  backgroundColor: colors.grey50,
                  ...borders.default,
                  borderColor: colors.grey50,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    marginRight: halfPadding,
                    backgroundColor: colors.green500,
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="share-social-outline" size={14} />
                </View>
                <Text style={{ ...texts.xs }}>
                  {t('Compartilhe esse restaurante com seus amigos!')}
                </Text>
              </PaddedView>
            </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => navigation.navigate('FoodOrderCheckout')}
          style={{ paddingBottom: Platform.OS === 'ios' && tallerDevice ? halfPadding : 0 }}
        >
          <HR />
          <CartButton order={activeOrder} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

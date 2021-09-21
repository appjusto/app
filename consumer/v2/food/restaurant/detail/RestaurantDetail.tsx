import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, SectionList, Share, Text, TouchableOpacity, View } from 'react-native';
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
import { borders, colors, halfPadding, screens, texts } from '../../../../../common/styles';
import { getExtra } from '../../../../../common/utils/config';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { RestaurantHeader } from '../../common/RestaurantHeader';
import { FoodOrderNavigatorParamList } from '../../types';
import { ProductListItem } from '../product/ProductListItem';
import { RestaurantNavigatorParamList } from '../types';
import { CartButton } from './CartButton';
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
  const extra = useSelector(getExtra);
  //
  const domain = `${extra.environment === 'live' ? '' : `${extra.environment}.`}appjusto.com.br`;
  const businessDeeplink = `https://${domain}/r/${restaurant?.slug ?? restaurant?.code}`;
  // side effects
  // setting the restaurant.name in the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [navigation, restaurant]);
  // handlers
  const shareRestaurantHandler = async () => {
    try {
      Share.share({
        message: `Pedi em ${
          restaurant!.name
        } usando o AppJusto, uma plataforma de delivery mais justa para clientes, entregadores e restaurantes. Peça também e faça parte desse movimento: ${businessDeeplink}`,
        title: 'AppJusto',
        url: businessDeeplink,
      });
    } catch (error) {}
  };

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
            <View style={{ marginTop: halfPadding, paddingRight: 12 }}>
              <SingleHeader title={section.title} textTransform="capitalize" />
            </View>
          ) : null;
        }}
        renderItem={({ item }) => {
          const touchableItem = (
            <TouchableOpacity
              onPress={() => navigation.navigate('ItemDetail', { productId: item.id })}
            >
              <ProductListItem key={item.id} product={item} complements={item.complementsEnabled} />
            </TouchableOpacity>
          );
          const available = item.availability?.map((item) => item.checked);
          const itemSchedules = item.availability?.map((product) => product.schedule);
          if (available) {
            const today = new Date();
            const dayIndex = today.getDay() - 1;
            const daySchedule = itemSchedules![dayIndex];
            let n = 0;
            let shouldShow = false;
            while (daySchedule.length > n && shouldShow === false) {
              const period = daySchedule[n];
              const startHour = parseInt(period.from.slice(0, 2));
              const startMinute = parseInt(period.from.slice(2, 4));
              const endHour = parseInt(period.to.slice(0, 2));
              const endMinute = parseInt(period.to.slice(2, 4));
              shouldShow =
                dayjs().hour(startHour).minute(startMinute).isSameOrBefore(today) &&
                dayjs().hour(endHour).minute(endMinute).isSameOrAfter(today);
              n++;
            }
            if (isEmpty(daySchedule)) return touchableItem; // available for the whole day
            return shouldShow ? touchableItem : null; // available in a period of time in that day
          } else if (available === undefined) {
            return touchableItem; // always available
          } else return null;
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

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../../../common/components/containers/PaddedView';
import { distanceBetweenLatLng } from '../../../../../../common/store/api/helpers';
import { useLastRestaurants } from '../../../../../../common/store/api/order/hooks/useLastRestaurants';
import { getConsumer, getCurrentLocation } from '../../../../../../common/store/consumer/selectors';
import { padding } from '../../../../../../common/styles';
import { RestaurantListItem } from '../../../../../v2/food/restaurant/list/RestaurantListItem';
import { DoubleHeaderV3 } from '../../../../common/texts/DoubleHeaderV3';

interface Props {
  onSelectBusiness: (businessId: string) => void;
}

export const FoodOrderHomeRecent = ({ onSelectBusiness }: Props) => {
  // redux
  const consumer = useSelector(getConsumer);
  const location = useSelector(getCurrentLocation);
  // state
  const recentRestaurants = useLastRestaurants(consumer?.id);
  // UI
  if (!recentRestaurants.length) return null;
  return (
    <PaddedView>
      <DoubleHeaderV3
        title="Pedidos recentemente"
        subtitle="Pedidos recentemente e abertos agora"
      />
      <View style={{ paddingTop: padding }}>
        {recentRestaurants.map((restaurant) => (
          <TouchableOpacity onPress={() => onSelectBusiness(restaurant.id)} key={restaurant.id}>
            <RestaurantListItem
              id={restaurant.id}
              restaurant={restaurant}
              cuisine={restaurant.cuisine}
              distance={
                location && restaurant.businessAddress?.latlng
                  ? distanceBetweenLatLng(location, restaurant.businessAddress.latlng)
                  : undefined
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    </PaddedView>
  );
};

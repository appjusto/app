import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useLastRestaurants } from '../../../../../../common/store/api/order/hooks/useLastRestaurants';
import { getConsumer } from '../../../../../../common/store/consumer/selectors';
import { padding } from '../../../../../../common/styles';
import { DoubleHeaderV3 } from '../../../../common/texts/DoubleHeaderV3';
import { FoodOrderHomeaRecentItem } from './FoodOrderHomeaRecentItem';

interface Props {
  onSelectBusiness: (businessId: string) => void;
}

export const FoodOrderHomeRecent = ({ onSelectBusiness }: Props) => {
  // redux
  const consumer = useSelector(getConsumer);
  // state
  const recentRestaurants = useLastRestaurants(consumer?.id);
  // UI
  if (!recentRestaurants.length) return null;
  return (
    <View style={{ paddingHorizontal: padding }}>
      <DoubleHeaderV3
        title="Pedidos recentemente"
        subtitle="Pedidos recentemente e abertos agora"
      />
      <View style={{ flexDirection: 'row', paddingTop: padding }}>
        {recentRestaurants.map((restaurant) => (
          <TouchableOpacity onPress={() => onSelectBusiness(restaurant.id)} key={restaurant.id}>
            <View style={{ marginRight: padding }}>
              <FoodOrderHomeaRecentItem businessId={restaurant.id} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

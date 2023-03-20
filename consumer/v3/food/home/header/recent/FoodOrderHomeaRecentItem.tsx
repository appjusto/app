import React from 'react';
import { View } from 'react-native';
import { useBusinessLogoURI } from '../../../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { ListItemImage } from '../../../../../v2/food/restaurant/list/ListItemImage';
interface Props {
  businessId: string;
}
export const FoodOrderHomeaRecentItem = ({ businessId }: Props) => {
  const { data: logo } = useBusinessLogoURI(businessId);
  return (
    <View>
      <ListItemImage uri={logo} height={80} width={80} borderRadius={80} />
    </View>
  );
};
